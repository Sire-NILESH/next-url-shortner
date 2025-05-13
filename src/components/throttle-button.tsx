"use client";

import { useState, useTransition } from "react";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import { VariantProps } from "class-variance-authority";
import { buttonVariants } from "./ui/button";
import useThrottle from "@/hooks/useThrottle";

type ThrottleButtonProps = {
  onThrottledClick: () => void;
  delayInMS?: number;
  showLoadingText?: boolean;
  loadingText?: string;
  idleText?: string;
  loadingIcon?: React.ReactNode;
  idleIcon?: React.ReactNode;
} & React.ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants>;

export default function ThrottleButton({
  onThrottledClick,
  delayInMS = 5000,
  showLoadingText = false,
  loadingText = "Loading...",
  idleText,
  loadingIcon,
  idleIcon,
  className,
  variant = "outline",
  size = "default",
  ...props
}: ThrottleButtonProps) {
  const [isThrottled, setIsThrottled] = useState(false);
  const [isPending, startTransition] = useTransition();

  const throttledAction = useThrottle(() => {
    setIsThrottled(true);
    startTransition(() => {
      onThrottledClick();
    });
    setTimeout(() => setIsThrottled(false), delayInMS);
  }, delayInMS);

  const disabled = isThrottled || isPending;

  return (
    <Button
      variant={variant}
      size={size}
      onClick={throttledAction}
      disabled={disabled}
      title={disabled ? "Disabled" : "Click"}
      className={cn("gap-2", disabled ? "cursor-not-allowed" : null, className)}
      type="button"
      {...props}
    >
      {isPending ? loadingIcon ?? idleIcon : idleIcon}
      {showLoadingText && (isPending ? loadingText : idleText)}
    </Button>
  );
}
