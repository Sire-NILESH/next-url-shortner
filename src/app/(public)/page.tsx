import CTASection from "@/components/sections/cta/cta-section";
import FAQSection from "@/components/sections/faq/faq-section";
import FeatuesSection from "@/components/sections/features/features-section";
import TestimonialsSection from "@/components/sections/testimonials/testimonials-section";
import { CoreUrlShortner } from "@/components/urls/core-url-shortner/core-url-shortner";

export default function Home() {
  return (
    <div className="my-6 md:my-20 flex flex-1 flex-col">
      <main className="my-32 space-y-20">
        <section>
          <div className="space-y-16">
            {/* <div className="space-y-6">
              <h1 className="text-4xl pb-3 sm:text-6xl boldText !font-medium text-center">
                Everybody hates long boring links
              </h1>
              <p className="text-base text-muted-foreground mb-8 max-w-2xl mx-auto text-center">
                {
                  "Ever seen those long links embeded in the social media descriptions, cards, profiles and wonder how they ruin the asthetics?"
                }
              </p>
            </div> */}

            <div className="w-full max-w-4xl mx-auto text-center py-10 px-4 space-y-12">
              <h2 className="text-6xl mb-4 boldText">
                <span className="brandText">{"Shrinkify"}</span> {" Your Links"}
              </h2>

              <p className="text-xl text-muted-foreground font-medium max-w-3xl mx-auto">
                {
                  "Paste your long boring URL and get a shortified link. It's free and easy to use."
                }
              </p>

              <CoreUrlShortner />
            </div>
          </div>
        </section>

        <FeatuesSection />

        <TestimonialsSection />

        <FAQSection />

        <CTASection />
      </main>
    </div>
  );
}
