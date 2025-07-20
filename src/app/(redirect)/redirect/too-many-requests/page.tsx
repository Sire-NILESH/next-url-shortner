import Brand from "@/components/header/brand";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "429 - Too Many Requests  | Shrinkify",
  description:
    "You're sending requests a bit too fast. Please slow down and try again in a moment.",
};

export default function TooManyRequest() {
  return (
    <div className="flex flex-1 h-[calc(100vh-64px)] items-center justify-center px-4">
      <div className="w-full max-w-lg mx-auto text-center text-balance">
        <h1 className="text-4xl mb-4 font-bold tracking-tighter leading-tight bg-clip-text text-transparent bg-gradient-to-t from-neutral-500 to-white">
          Too Many Requests
        </h1>
        <p className="text-neutral-400 mb-6 text-balance">
          {
            "Whoa there! too many requests. To protect our service, we've temporarily limited your requests."
          }
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
