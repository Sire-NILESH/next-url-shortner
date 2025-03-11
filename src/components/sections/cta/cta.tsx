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
      <div className="sm:mx-auto flex flex-col sm:items-center gap-6 sm:px-8 py-12 sm:text-center sm:gap-8">
        {/* Badge */}
        {badge && (
          <Badge variant="outline" className="w-fit">
            <span className="text-foreground text-base">{badge.text}</span>
          </Badge>
        )}

        {/* Title */}
        <h2 className="max-w-2xl text-3xl tracking-tighter !font-semibold boldText sm:text-5xl pb-4">
          {title}
        </h2>

        {/* Description */}
        {description && (
          <p className="text-lg max-w-[750px] leading-relaxed tracking-tight text-muted-foreground pb-4">
            {description}
          </p>
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
        <UserRatings className="mt-12 w-fit" />
      </div>
    </div>
  );
}
