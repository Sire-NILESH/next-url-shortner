"use client";

import { FacetedFilter } from "@/components/ui/faceted-filter";
import { useSearchParams, useRouter } from "next/navigation";
import { useCallback, useRef, useState } from "react";

const threatOptions = [
  { label: "Malware", value: "MALWARE" },
  { label: "Social engineering", value: "SOCIAL_ENGINEERING" },
  { label: "Unwanted software", value: "UNWANTED_SOFTWARE" },
  {
    label: "Potenitally harmful application",
    value: "POTENTIALLY_HARMFUL_APPLICATION",
  },
  { label: "Threat type unspecified", value: "THREAT_TYPE_UNSPECIFIED" },
];

const statusOptions = [
  { label: "Active", value: "active" },
  { label: "Inactive", value: "inactive" },
  { label: "Suspended", value: "suspended" },
];

const categoryOptions = [
  { label: "Safe", value: "safe" },
  { label: "Suspicious", value: "suspicious" },
  { label: "Malicious", value: "malicious" },
  { label: "Inappropriate", value: "inappropriate" },
  { label: "Unknown", value: "unknown" },
];

function parseParamSet(params: URLSearchParams, key: string) {
  return new Set(params.getAll(key).flatMap((v) => v.split(",")));
}

function buildQueryString(
  threats: Set<string>,
  statuses: Set<string>,
  categories: Set<string>
) {
  const params = new URLSearchParams();
  if (threats.size) params.set("threats", Array.from(threats).join(","));
  if (statuses.size) params.set("statuses", Array.from(statuses).join(","));
  if (categories.size)
    params.set("categories", Array.from(categories).join(","));
  return `?${params.toString()}`;
}

export function UrlFacetedFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [threats, setThreats] = useState(() =>
    parseParamSet(searchParams, "threats")
  );
  const [statuses, setStatuses] = useState(() =>
    parseParamSet(searchParams, "statuses")
  );
  const [categories, setCategories] = useState(() =>
    parseParamSet(searchParams, "categories")
  );

  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  const updateUrlParams = useCallback(
    (
      nextThreats: Set<string>,
      nextStatuses: Set<string>,
      nextCategories: Set<string>
    ) => {
      if (debounceRef.current) clearTimeout(debounceRef.current);

      debounceRef.current = setTimeout(() => {
        const query = buildQueryString(
          nextThreats,
          nextStatuses,
          nextCategories
        );
        router.push(query);
      }, 1000);
    },
    [router]
  );

  const handleFilterChange = (
    key: "threats" | "statuses" | "categories",
    values: Set<string>
  ) => {
    if (key === "threats") setThreats(values);
    else if (key === "statuses") setStatuses(values);
    else if (key === "categories") setCategories(values);

    updateUrlParams(
      key === "threats" ? values : threats,
      key === "statuses" ? values : statuses,
      key === "categories" ? values : categories
    );
  };

  return (
    <div className="flex flex-wrap gap-2">
      <FacetedFilter
        title="Threat"
        options={threatOptions}
        selectedValues={threats}
        onSelectionChange={(v) => handleFilterChange("threats", v)}
      />
      <FacetedFilter
        title="Status"
        options={statusOptions}
        selectedValues={statuses}
        onSelectionChange={(v) => handleFilterChange("statuses", v)}
      />
      <FacetedFilter
        title="Category"
        options={categoryOptions}
        selectedValues={categories}
        onSelectionChange={(v) => handleFilterChange("categories", v)}
      />
    </div>
  );
}
