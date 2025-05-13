"use client";

import { useState, useTransition } from "react";
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
  delayInMS = 5000,
  showText = false,
  className,
  variant = "outline",
  size = "default",
  ...props
}: RefreshButtonProps) {
  const router = useRouter();
  const [isThrottled, setIsThrottled] = useState(false);
  const [isPending, startTransition] = useTransition();

  const throttledRefresh = useThrottle(() => {
    setIsThrottled(true);
    startTransition(() => {
      router.refresh();
    });
    setTimeout(() => setIsThrottled(false), delayInMS);
  }, delayInMS);

  return (
    <Button
      variant={variant}
      size={size}
      onClick={throttledRefresh}
      disabled={isThrottled || isPending}
      title={isThrottled || isPending ? "Disabled" : "Click to refresh"}
      className={cn(
        "gap-2",
        isThrottled ? "cursor-not-allowed" : null,
        className
      )}
      type="button"
      {...props}
    >
      <RefreshCw className={cn("size-4", isPending ? "animate-spin" : null)} />
      {showText && (isPending ? "Refreshing..." : "Refresh")}
    </Button>
  );
}
