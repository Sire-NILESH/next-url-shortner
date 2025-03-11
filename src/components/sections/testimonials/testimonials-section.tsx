import {
  Section,
  SectionDescription,
  SectionProps,
  SectionTitle,
} from "@/components/sections/Section";
import { cn } from "@/lib/utils";
import { TestimonialsMarquee } from "./testimonials-marquee";

type Props = SectionProps & {};

const TestimonialsSection = ({ className, ...props }: Props) => {
  return (
    <Section className={cn("bg-transparent", className)} {...props}>
      <SectionTitle>{"Trusted by users worldwide"}</SectionTitle>
      <SectionDescription className="text-center">
        {
          "Join thousands of users from different fields of professions who are already generating shortified urls and enjoying the reliability."
        }
      </SectionDescription>

      <TestimonialsMarquee className="w-full" />
    </Section>
  );
};

export default TestimonialsSection;
