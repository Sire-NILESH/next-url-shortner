import {
  Table,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import React, { ComponentProps } from "react";

type Props = ComponentProps<"div"> & {
  limit?: number;
};

const UsersTableSkeleton = ({ className, limit, ...props }: Props) => {
  return (
    <div className={cn("rounded-md border", className)} {...props}>
      <Table>
        <TableHeader className="bg-secondary">
          <TableRow>
            <TableHead className="h-9"></TableHead>
          </TableRow>
        </TableHeader>
        {Array.from({ length: limit ? limit : 10 }).map((row, i) => (
          <TableRow key={i}>
            <TableCell
              colSpan={9}
              className="text-center h-15 bg-primary/10 animate-pulse"
            ></TableCell>
          </TableRow>
        ))}
      </Table>
    </div>
  );
};

export default UsersTableSkeleton;
