import { Section, SectionProps } from "@/components/sections/Section";
import { CoreUrlShortner } from "@/components/urls/core-url-shortner/core-url-shortner";
import { cn } from "@/lib/utils";

type Props = SectionProps & {};

const HeroSection = ({ className, ...props }: Props) => {
  return (
    <Section className={cn("bg-transparent pt-0", className)} {...props}>
      <div className="space-y-16">
        <div className="w-full max-w-4xl sm:mx-auto sm:text-center py-10 space-y-12">
          <h2 className="text-4xl sm:text-6xl mb-4 boldText tracking-tighter">
            <span className="brandText">{"Shrinkify"}</span> {" Your Links"}
          </h2>

          <p className="text-base sm:text-xl text-muted-foreground font-medium max-w-3xl mx-auto">
            {
              "Paste your long boring URL and get a shortified link. It's free and easy to use."
            }
          </p>

          <CoreUrlShortner />
        </div>
      </div>
    </Section>
  );
};

export default HeroSection;
