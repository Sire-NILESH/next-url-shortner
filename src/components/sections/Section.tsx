import { cn } from "@/lib/utils";
import { ComponentProps } from "react";

export type SectionProps = ComponentProps<"section">;
type TitleProps = ComponentProps<"p">;
type DescriptionProps = ComponentProps<"p">;

const Section = ({ className, children, ...props }: SectionProps) => {
  return (
    <section
      className={cn("bg-background text-foreground py-12 px-0", className)}
      {...props}
    >
      <div className="flex flex-col items-center gap-4 px-4 sm:gap-8">
        {children}
      </div>
    </section>
  );
};

const SectionTitle = ({ className, ...props }: TitleProps) => (
  <h2
    className={cn(
      "max-w-[720px] text-3xl boldText !font-semibold leading-tight sm:text-5xl sm:leading-tight",
      className
    )}
    {...props}
  ></h2>
);

const SectionDescription = ({ className, ...props }: DescriptionProps) => (
  <p
    className={cn(
      "text-md max-w-[750px] font-medium text-muted-foreground sm:text-xl",
      className
    )}
    {...props}
  ></p>
);

export { Section, SectionTitle, SectionDescription };
