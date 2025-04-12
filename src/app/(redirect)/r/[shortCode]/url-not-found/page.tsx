import { buttonVariants } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";
import { Metadata } from "next";
import Link from "next/link";
import React from "react";

export const metadata: Metadata = {
  title: "404 - Not Found | Shrinkify",
  description:
    "The shrinkify link you're trying to access doesn't exist or has been removed",
};

export default function RedirectNotFound() {
  return (
    <div className="flex h-[calc(100vh-64px)] items-center justify-center px-4">
      <div className="w-full max-w-md mx-auto text-center">
        <div className="flex justify-center mb-6">
          <div className="size-16 rounded-full bg-destructive/10 flex items-center justify-center">
            <AlertTriangle className="size-8 text-destructive" />
          </div>
        </div>
        <h1 className="text-2xl font-bold text-destructive mb-4">
          URL Not Found
        </h1>
        <p className="text-muted-foreground mb-6">
          The shrinkify link you&apos;re trying to access doesn&apos;t exist or
          has been removed.
        </p>
        <Link href={"/"} className={buttonVariants({ variant: "default" })}>
          Return to Homepage
        </Link>
      </div>
    </div>
  );
}
