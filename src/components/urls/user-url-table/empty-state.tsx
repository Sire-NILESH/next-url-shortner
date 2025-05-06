import { cn } from "@/lib/utils";
import React, { ComponentProps } from "react";

type Props = ComponentProps<"div"> & {};

export default function EmptyState({ className, ...props }: Props) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center h-184 space-y-2 rounded-xl text-center py-8 bg-muted",
        className
      )}
      {...props}
    >
      <p className="text-2xl !font-bold boldText">No url data available yet</p>
      <p className="text-base text-muted-foreground">
        Create some shrinkify URLs to see the table
      </p>
    </div>
  );
}
