import { Section, SectionProps } from "@/components/sections/Section";
import { cn } from "@/lib/utils";
import { CTA } from "./cta";

type Props = SectionProps & {};

const CTASection = ({ className, ...props }: Props) => {
  return (
    <Section
      className={cn("bg-transparent text-foreground", className)}
      {...props}
    >
      <CTA
        badge={{
          text: "Don't miss out",
        }}
        title="You really would not want to miss out on this"
        description="Shorten links instantly, track clicks effortlessly, and share smarter. Boost engagement, enhance branding, and simplify your URLs today because every character counts. Try it now and transform the way you share links!"
        action={{
          text: "Create account",
          href: "/register",
          variant: "default",
        }}
      />
    </Section>
  );
};

export default CTASection;
