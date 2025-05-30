"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { UserRatings } from "./user-ratings";
import { SectionContent, SectionDescription, SectionTitle } from "../Section";

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
          <Badge variant="default" className="w-fit">
            <span className="text-primary-foreground text-sm sm:text-base uppercase tracking-tight">
              {badge.text}
            </span>
          </Badge>
        )}

        {/* Title */}
        <SectionTitle className="max-w-2xl text-3xl sm:text-5xl">
          {title}
        </SectionTitle>

        {/* Description */}
        {description && (
          <SectionDescription className="pb-4">
            {description}
          </SectionDescription>
        )}

        <SectionContent className="sm:mx-auto flex flex-col sm:items-center space-y-20">
          {/* User Ratings */}
          <UserRatings className="w-fit" />

          {/* Action Button */}
          <div className="flex gap-3">
            <Button size="lg" asChild>
              <Link href={action.href}>{action.text}</Link>
            </Button>
            <Button variant={"outline"} size="lg" asChild>
              <Link href={"/"}>{"Learn more"}</Link>
            </Button>
          </div>
        </SectionContent>
      </div>
    </div>
  );
}
