import Brand from "@/components/header/brand";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "404 - Not Found | Shrinkify",
  description:
    "The shrinkify link you're trying to access doesn't exist or has been removed",
};

export default function RedirectNotFound() {
  return (
    <div className="flex flex-1 h-[calc(100vh-64px)] items-center justify-center px-4">
      <div className="w-full max-w-md mx-auto text-center">
        <h1 className="text-4xl mb-4 font-bold tracking-tighter leading-tight bg-clip-text text-transparent bg-gradient-to-t from-neutral-500 to-white">
          404 - URL Not Found
        </h1>
        <p className="text-neutral-400 mb-6">
          The shrinkify link you&apos;re trying to access doesn&apos;t exist or
          has been removed.
        </p>

        <div className="mt-10 h-20 flex items-center justify-center ">
          <div className="rounded-lg border border-transparent hover:border-neutral-700">
            <Brand className="text-4xl h-full w-full px-4 py-2" />
          </div>
        </div>
      </div>
    </div>
  );
}
