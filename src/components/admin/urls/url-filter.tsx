"use client";

// import RefreshButton from "@/components/refresh-button";
import { Button } from "@/components/ui/button";
import { GetAllUrlsOptions } from "@/server/actions/admin/urls/get-all-urls";
import { AlertTriangle, BadgeCheck, Flag, ShieldAlert } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import RefreshUrlsButton from "./refresh-urls-button";
import { UrlFacetedFilter } from "./url-faceted-filter";

interface UrlFilterProps {
  initialFilter: GetAllUrlsOptions["filter"];
  refreshHandler: () => void;
}

export function UrlFilter({ initialFilter, refreshHandler }: UrlFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const createQueryString = useCallback(
    (name: string, value: string) => {
      let params = new URLSearchParams();
      if (value !== "all") {
        // if not "all" then also consider the previous search params and extend it. "all" is treated like a clear search params
        params = new URLSearchParams(searchParams);
      }
      params.set(name, value);
      params.set("page", "1");
      return params.toString();
    },
    [searchParams]
  );

  const handleFilterChange = (filter: string) => {
    router.push(`${pathname}?${createQueryString("filter", filter)}`);
  };

  return (
    <div className="flex flex-wrap gap-2 mb-4">
      <Button
        variant={initialFilter === "all" ? "default" : "outline"}
        size={"sm"}
        onClick={() => handleFilterChange("all")}
        className="gap-2"
      >
        All URLs
      </Button>

      <Button
        variant={initialFilter === "safe" ? "secondary" : "outline"}
        size={"sm"}
        onClick={() => handleFilterChange("safe")}
        className="gap-2 text-green-600 dark:text-green-400"
      >
        <BadgeCheck className="size-4" />
        Safe
      </Button>

      <Button
        variant={initialFilter === "flagged" ? "secondary" : "outline"}
        size={"sm"}
        onClick={() => handleFilterChange("flagged")}
        className="gap-2 text-yellow-600 dark:text-yellow-400"
      >
        <Flag className="size-4" />
        All Flagged
      </Button>

      <Button
        variant={initialFilter === "caution" ? "secondary" : "outline"}
        size={"sm"}
        onClick={() => handleFilterChange("caution")}
        className="gap-2 text-orange-600 dark:text-orange-400"
      >
        <AlertTriangle className="size-4" />
        Caution
      </Button>

      <Button
        variant={initialFilter === "security" ? "secondary" : "outline"}
        size={"sm"}
        onClick={() => handleFilterChange("security")}
        className="gap-2 text-red-600 dark:text-red-400"
      >
        <ShieldAlert className="size-4" />
        Security Risks
      </Button>

      <UrlFacetedFilter />

      <RefreshUrlsButton onClickHandler={refreshHandler} />
    </div>
  );
}
