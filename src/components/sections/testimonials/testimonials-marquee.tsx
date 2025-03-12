import { cn } from "@/lib/utils";
import {
  TestimonialCard,
  TestimonialAuthor,
} from "@/components/sections/testimonials/testimonial-card";
import { ComponentProps } from "react";
import { testimonialsData } from "./testimonials-data";

type Testimonial = {
  author: TestimonialAuthor;
  text: string;
  href?: string;
};

type TestimonialsMarqueeProps = ComponentProps<"div"> & {
  testimonials?: Testimonial[];
};

export function TestimonialsMarquee({
  testimonials = testimonialsData,
  className,
  ...props
}: TestimonialsMarqueeProps) {
  return (
    <div
      className={cn(
        "mx-auto flex max-w-container flex-col items-center gap-4 text-center sm:gap-16",
        className
      )}
      {...props}
    >
      <div className="relative flex w-full flex-col items-center justify-center overflow-hidden">
        <div className="group flex overflow-hidden p-2 [--gap:1rem] [gap:var(--gap)] flex-row [--duration:40s]">
          <div className="flex shrink-0 justify-around [gap:var(--gap)] animate-marquee flex-row group-hover:[animation-play-state:paused]">
            {[...Array(4)].map((_, setIndex) =>
              testimonials.map((testimonial, i) => (
                <TestimonialCard key={`${setIndex}-${i}`} {...testimonial} />
              ))
            )}
          </div>
        </div>

        <div className="pointer-events-none absolute inset-y-0 left-0 hidden w-1/3 bg-gradient-to-r dark:from-black from-[#f6f7f8] sm:block" />
        <div className="pointer-events-none absolute inset-y-0 right-0 hidden w-1/3 bg-gradient-to-l dark:from-black from-[#f6f7f8] sm:block" />
      </div>
    </div>
  );
}
