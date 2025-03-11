import CTASection from "@/components/sections/cta/cta-section";
import FAQSection from "@/components/sections/faq/faq-section";
import FeatuesSection from "@/components/sections/features/features-section";
import HeroSection from "@/components/sections/hero/hero-section";
import TestimonialsSection from "@/components/sections/testimonials/testimonials-section";

export default function Home() {
  return (
    <div className="my-6 md:my-20 flex flex-1 flex-col">
      <main className="my-32 space-y-20">
        <HeroSection />

        <FeatuesSection />

        <TestimonialsSection />

        <FAQSection />

        <CTASection />
      </main>
    </div>
  );
}
