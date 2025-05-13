"use no memo";

import { DataTableViewOptions } from "@/components/data-table/column-toggle";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { UserUrl } from "@/types/client/types";
import { Table } from "@tanstack/react-table";
import { DownloadIcon, Search } from "lucide-react";
import { ComponentProps } from "react";

type Props = ComponentProps<"div"> & {
  table: Table<UserUrl>;
  isLoading: boolean;
  error: Error | null;
  onExport: () => void;
};

export default function TableToolbar({
  table,
  isLoading,
  error,
  onExport,
  className,
  ...props
}: Props) {
  return (
    <div
      className={cn(
        "flex flex-wrap items-end justify-between gap-4 py-4",
        className
      )}
      {...props}
    >
      <SearchInput table={table} />
      <div className="flex flex-wrap gap-2">
        <ExportButton isLoading={isLoading} error={error} onExport={onExport} />
        <DataTableViewOptions table={table} />
      </div>
    </div>
  );
}

function SearchInput({ table }: { table: Table<UserUrl> }) {
  const globalFilter = table.getState().globalFilter;
  const setGlobalFilter = table.setGlobalFilter;
  return (
    <div className="relative w-full md:w-72">
      <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      <Input
        placeholder="Search URLs..."
        value={globalFilter ?? ""}
        onChange={(e) => setGlobalFilter(e.target.value)}
        className="pl-8"
      />
    </div>
  );
}

function ExportButton({
  // table,
  isLoading,
  error,
  onExport,
}: {
  isLoading: boolean;
  onExport: () => void;
  error: Error | null;
}) {
  return (
    <Button
      variant="outline"
      size="sm"
      disabled={isLoading || !!error}
      onClick={onExport}
      className="ml-auto h-8 lg:flex"
    >
      <DownloadIcon className="mr-2 size-4" />
      Export CSV
    </Button>
  );
}
