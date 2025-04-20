import Brand from "@/components/header/brand";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { WarnRedirectSearchParams } from "@/types/server/types";
import { AlertTriangle, ExternalLink } from "lucide-react";
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Warning | Shrinkify",
  description: "The shrinkify link you're trying to access has been flagged",
};

type Props = {
  searchParams: Promise<WarnRedirectSearchParams>;
};

export default async function RedirectUrlWarningPage({ searchParams }: Props) {
  const searchParamsObj = await searchParams;

  const redirectUrl = searchParamsObj.redirect
    ? decodeURIComponent(searchParamsObj.redirect)
    : undefined;

  const reason = searchParamsObj.reason
    ? decodeURIComponent(searchParamsObj.reason)
    : "The URL your're trying to access has been flagged";

  const threat = searchParamsObj.threat
    ? searchParamsObj.threat.split("_").join(" ")
    : undefined;

  return (
    <div
      className={cn(
        "flex flex-1 h-[calc(100vh-64px)] items-center justify-center px-4",
        threat ? "bg-red-600/40" : null
      )}
    >
      <div className="w-full max-w-xl mx-auto text-center">
        <div className="flex flex-col items-center justify-center mb-6 gap-4">
          <div
            className={cn(
              "size-16 rounded-full flex items-center justify-center",
              threat ? "bg-red-400/20" : "bg-yellow-400/40"
            )}
          >
            <AlertTriangle
              className={cn(
                "size-8 text-destructive",
                threat ? "text-red-500" : "text-yellow-500"
              )}
            />
          </div>

          {threat ? <Badge variant="default">{threat}</Badge> : null}
        </div>
        <h1 className="text-4xl mb-4 font-bold tracking-tighter leading-tight bg-clip-text text-transparent bg-gradient-to-t from-neutral-500 to-white">
          {threat ? "Danger" : "Caution"} : Flagged URL
        </h1>

        <p className="text-neutral-400 mb-6">{reason}</p>

        {!threat && redirectUrl ? (
          <div className="mt-18 space-y-4">
            <p className="">{"Proceed at your own risk"}</p>

            <div className="flex justify-center items-center">
              <Link
                href={redirectUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  buttonVariants({ variant: "default" }),
                  "w-full max-w-70"
                )}
              >
                <ExternalLink className="size-4" />
                Visit URL
              </Link>
            </div>
          </div>
        ) : null}

        <div className="mt-10 h-20 flex items-center justify-center ">
          <div className="rounded-lg border border-transparent hover:border-neutral-700">
            <Brand className="text-4xl h-full w-full px-4 py-2" />
          </div>
        </div>
      </div>
    </div>
  );
}
