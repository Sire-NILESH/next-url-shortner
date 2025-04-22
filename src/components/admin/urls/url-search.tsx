"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, X } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

interface UrlSearchProps {
  initialSearch: string;
}

export function UrlSearch({ initialSearch }: UrlSearchProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const [search, setSearch] = useState(initialSearch);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();

    const params = new URLSearchParams(searchParams.toString());

    // reset to first page when searching
    params.set("page", "1");

    if (search) {
      params.set("search", search);
    } else {
      params.delete("search");
    }

    router.push(`${pathname}?${params.toString()}`);
  };

  const clearSearch = () => {
    setSearch("");

    const params = new URLSearchParams(searchParams.toString());
    params.delete("search");
    params.set("page", "1");

    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <form onSubmit={handleSearch} className="flex gap-2">
      <div className="relative flex-1">
        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search URLs"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-8"
        />
        {search && (
          <Button
            variant={"outline"}
            onClick={clearSearch}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 h-auto rounded-full size-5 p-0"
          >
            <X className="size-3" />
          </Button>
        )}
      </div>
      <Button type="submit">
        <Search />
      </Button>
    </form>
  );
}
