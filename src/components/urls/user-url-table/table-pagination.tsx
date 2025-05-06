"use no memo";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { UserUrl } from "@/types/client/types";
import { Table } from "@tanstack/react-table";
import { ComponentProps } from "react";

type Props = ComponentProps<"div"> & { table: Table<UserUrl> };

export default function TablePagination({ table, className, ...props }: Props) {
  return (
    <div
      className={cn(
        "flex items-center justify-between flex-wrap-reverse",
        className
      )}
      {...props}
    >
      <p className="text-muted-foreground text-xs">
        {`Showing ${table.getRowModel().rows.length} of ${
          table.getFilteredRowModel().rows.length
        } URLs`}
      </p>
      <div className="flex items-center justify-end space-x-2 py-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
