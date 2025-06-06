import {
  Section,
  SectionDescription,
  SectionProps,
  SectionTitle,
} from "@/components/sections/Section";
import { cn } from "@/lib/utils";
import { TestimonialsMarquee } from "./testimonials-marquee";
import { Badge } from "@/components/ui/badge";

type Props = SectionProps & {};

const TestimonialsSection = ({ className, ...props }: Props) => {
  return (
    <Section
      className={cn("bg-transparent sm:text-center", className)}
      {...props}
    >
      <Badge variant="default" className="w-fit">
        <span className="text-primary-foreground text-sm sm:text-base uppercase tracking-tight">
          {"Testimonials"}
        </span>
      </Badge>

      <SectionTitle className="sm:text-center">
        {"Trusted by users worldwide"}
      </SectionTitle>
      <SectionDescription className="sm:text-center">
        {
          "Join thousands of users from different fields of professions who are already generating shortified urls and enjoying the reliability."
        }
      </SectionDescription>

      <TestimonialsMarquee className="w-full mt-6" />
    </Section>
  );
};

export default TestimonialsSection;
