"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { UserRatings } from "./user-ratings";

interface CTAProps {
  badge?: {
    text: string;
  };
  title: string;
  description?: string;
  action: {
    text: string;
    href: string;
    variant?: "default" | "glow";
  };
  className?: string;
}

export function CTA({
  badge,
  title,
  description,
  action,
  className,
}: CTAProps) {
  return (
    <div className={cn("overflow-hidden pt-0 md:pt-0", className)}>
      <div className="mx-auto flex flex-col items-center gap-6 px-8 py-12 text-center sm:gap-8">
        {/* Badge */}
        {badge && (
          <Badge variant="outline">
            <span className="text-muted-foreground text-base">
              {badge.text}
            </span>
          </Badge>
        )}

        {/* Title */}
        <h2 className="text-3xl !font-semibold boldText sm:text-5xl pb-4">
          {title}
        </h2>

        {/* Description */}
        {description && (
          <p className="text-muted-foreground max-w-[720px]">{description}</p>
        )}

        {/* Action Button */}
        <div className="flex gap-3">
          <Button size="lg" asChild>
            <Link href={action.href}>{action.text}</Link>
          </Button>
          <Button variant={"outline"} size="lg" asChild>
            <Link href={"/"}>{"Learn more"}</Link>
          </Button>
        </div>

        {/* User Ratings */}
        <UserRatings className="mt-12 scale-150" />
      </div>
    </div>
  );
}
