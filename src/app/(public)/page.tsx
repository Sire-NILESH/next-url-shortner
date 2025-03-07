import { CoreUrlShortner } from "@/components/urls/core-url-shortner/core-url-shortner";

export default function Home() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center md:p-24">
      <div className="w-full max-w-3xl mx-auto text-center bg-card rounded-3xl border border-border py-10 px-3 space-y-8 shadow">
        <h1 className="text-4xl mb-4 boldText">
          <span className="brandText">{"Shrinkify"}</span> {" Your Links"}
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
