import { cn } from "@/lib/utils";
import { AlertTriangle } from "lucide-react";
import React, { ComponentProps } from "react";

type Props = ComponentProps<"div"> & {};

const SeedUnavailable = ({ className, ...props }: Props) => {
  return (
    <div
      className={cn(
        "bg-muted px-4 py-6 rounded-md space-y-2 shadow",
        className
      )}
      {...props}
    >
      <h3 className="flex items-center gap-2 font-medium">
        <AlertTriangle className="size-5" />
        Seed Form Unavailable For Production
      </h3>
    </div>
  );
};

export default SeedUnavailable;
