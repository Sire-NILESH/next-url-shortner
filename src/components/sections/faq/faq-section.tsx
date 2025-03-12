import { Section, SectionProps } from "@/components/sections/Section";
import { cn } from "@/lib/utils";
import { FAQ } from "./faq";

type Props = SectionProps & {};

const FAQSection = ({ className, ...props }: Props) => {
  return (
    <Section className={cn("bg-transparent", className)} {...props}>
      <FAQ />
    </Section>
  );
};

export default FAQSection;
