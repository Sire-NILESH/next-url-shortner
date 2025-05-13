"use client";

import { FacetedFilter } from "@/components/ui/faceted-filter";
import { useSearchParams, useRouter } from "next/navigation";
import { useCallback, useRef, useState } from "react";

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

  const [roles, setRoles] = useState(() =>
    parseParamSet(searchParams, "roles")
  );
  const [statuses, setStatuses] = useState(() =>
    parseParamSet(searchParams, "statuses")
  );
  const [providers, setProviders] = useState(() =>
    parseParamSet(searchParams, "providers")
  );

  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  const updateUrlParams = useCallback(
    (
      nextRoles: Set<string>,
      nextStatuses: Set<string>,
      nextProviders: Set<string>
    ) => {
      if (debounceRef.current) clearTimeout(debounceRef.current);

      debounceRef.current = setTimeout(() => {
        const query = buildQueryString(nextRoles, nextStatuses, nextProviders);
        router.push(query);
      }, 1000);
    },
    [router]
  );

  const handleFilterChange = (
    key: "roles" | "statuses" | "providers",
    values: Set<string>
  ) => {
    if (key === "roles") setRoles(values);
    else if (key === "statuses") setStatuses(values);
    else if (key === "providers") setProviders(values);

    updateUrlParams(
      key === "roles" ? values : roles,
      key === "statuses" ? values : statuses,
      key === "providers" ? values : providers
    );
  };

  return (
    <div className="flex flex-wrap gap-2">
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
