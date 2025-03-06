import { CoreUrlShortner } from "@/components/urls/core-url-shortner/core-url-shortner";

export default function Home() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center p-6 md:p-24">
      <div className="w-full max-w-3xl mx-auto text-center">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 bg-clip-text text-transparent bg-gradient-to-b from-neutral-700 via-neutral-700 to-neutral-700 dark:from-neutral-800 dark:via-neutral-400 dark:to-white">
          Shrinkify Your Links
        </h1>

        <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
          {
            "Paste your long URL and get a shortened one. It's free and easy to use."
          }
        </p>

        <CoreUrlShortner />
      </div>
    </div>
  );
}
