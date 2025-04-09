"use client";

import { useState } from "react";
import { RefreshCw } from "lucide-react";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";
import useThrottle from "@/hooks/useThrottle";
import { cn } from "@/lib/utils";
import { VariantProps } from "class-variance-authority";
import { buttonVariants } from "./ui/button";

type RefreshButtonProps = {
  delayInMS?: number;
  showText?: boolean;
} & React.ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants>;

export default function RefreshButton({
  delayInMS = 500,
  showText = false,
  className,
  variant = "outline",
  size = "default",
  ...props
}: RefreshButtonProps) {
  const router = useRouter();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const throttledRefresh = useThrottle(() => {
    setIsRefreshing(true);
    router.refresh();
    setTimeout(() => setIsRefreshing(false), delayInMS);
  }, delayInMS);

  return (
    <Button
      variant={variant}
      size={size}
      onClick={throttledRefresh}
      disabled={isRefreshing}
      className={cn("gap-2", className)}
      type="button"
      {...props}
    >
      {isRefreshing ? (
        <RefreshCw className="size-4 animate-spin" />
      ) : (
        <RefreshCw className="size-4" />
      )}
      {showText && (isRefreshing ? "Refreshing..." : "Refresh")}
    </Button>
  );
}
