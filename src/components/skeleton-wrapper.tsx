import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import React, { ReactNode } from "react";

function SkeletonWrapper({
  children,
  isLoading,
  className,
  fullWidth = true,
}: {
  children: ReactNode;
  className?: string;
  isLoading: boolean;
  fullWidth?: boolean;
}) {
  if (!isLoading) return children;
  return (
    <Skeleton className={cn(fullWidth && "w-full", className)}>
      <div className="opacity-0 pointer-events-none">{children}</div>
    </Skeleton>
  );
}

export default SkeletonWrapper;
