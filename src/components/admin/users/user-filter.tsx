"use client";

import { Button } from "@/components/ui/button";
import { FacetedFilter } from "@/components/ui/faceted-filter";
import { useSearchParams, useRouter } from "next/navigation";
import { useRef, useState } from "react";

const roleOptions = [
  { label: "Admin", value: "admin" },
  { label: "User", value: "user" },
];

const statusOptions = [
  { label: "Active", value: "active" },
  { label: "Inactive", value: "inactive" },
  { label: "Suspended", value: "suspended" },
];

const providerOptions = [
  { label: "Google", value: "google" },
  { label: "Credentials", value: "credentials" },
];

function parseParamSet(params: URLSearchParams, key: string) {
  return new Set(params.getAll(key).flatMap((v) => v.split(",")));
}

function buildQueryString(
  roles: Set<string>,
  statuses: Set<string>,
  providers: Set<string>
) {
  const params = new URLSearchParams();
  if (roles.size) params.set("roles", Array.from(roles).join(","));
  if (statuses.size) params.set("statuses", Array.from(statuses).join(","));
  if (providers.size) params.set("providers", Array.from(providers).join(","));
  return `?${params.toString()}`;
}

export function UserFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const searchParamsSnapshot = useRef<string>("");

  const externalRoles = parseParamSet(searchParams, "roles");
  const externalStatuses = parseParamSet(searchParams, "statuses");
  const externalProviders = parseParamSet(searchParams, "providers");
  const hasParams =
    !!externalRoles.size || !!externalStatuses.size || !!externalProviders.size;

  const [roles, setRoles] = useState(externalRoles);
  const [statuses, setStatuses] = useState(externalStatuses);
  const [providers, setProviders] = useState(externalProviders);

  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  // Sync state with URL when URL changes outside the component
  const currentParamsStr = searchParams.toString();
  if (searchParamsSnapshot.current !== currentParamsStr) {
    searchParamsSnapshot.current = currentParamsStr;
    setRoles(externalRoles);
    setStatuses(externalStatuses);
    setProviders(externalProviders);
  }

  function updateUrlParams(
    nextRoles: Set<string>,
    nextStatuses: Set<string>,
    nextProviders: Set<string>
  ) {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(() => {
      const query = buildQueryString(nextRoles, nextStatuses, nextProviders);
      router.push(query);
    }, 1000);
  }

  function handleFilterChange(
    key: "roles" | "statuses" | "providers",
    values: Set<string>
  ) {
    const nextRoles = key === "roles" ? values : roles;
    const nextStatuses = key === "statuses" ? values : statuses;
    const nextProviders = key === "providers" ? values : providers;

    setRoles(nextRoles);
    setStatuses(nextStatuses);
    setProviders(nextProviders);

    updateUrlParams(nextRoles, nextStatuses, nextProviders);
  }

  function resetFilters() {
    setRoles(new Set());
    setStatuses(new Set());
    setProviders(new Set());
    router.push(window.location.pathname);
  }

  return (
    <div className="flex flex-wrap gap-2">
      <Button
        variant={hasParams ? "outline" : "default"}
        size={"sm"}
        onClick={resetFilters}
        className="gap-2"
      >
        All Users
      </Button>

      <FacetedFilter
        title="Role"
        options={roleOptions}
        selectedValues={roles}
        onSelectionChange={(v) => handleFilterChange("roles", v)}
      />
      <FacetedFilter
        title="Status"
        options={statusOptions}
        selectedValues={statuses}
        onSelectionChange={(v) => handleFilterChange("statuses", v)}
      />
      <FacetedFilter
        title="Provider"
        options={providerOptions}
        selectedValues={providers}
        onSelectionChange={(v) => handleFilterChange("providers", v)}
      />
    </div>
  );
}
