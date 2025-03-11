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
        description="Managing a small business today is already tough. Avoid further complications by ditching outdated, tedious trade methods. Our goal is to streamline SMB trade, making it easier and faster than ever."
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
