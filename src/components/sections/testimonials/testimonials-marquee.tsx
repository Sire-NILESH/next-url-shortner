"use client";

import {
  TestimonialAuthor,
  TestimonialCard,
} from "@/components/sections/testimonials/testimonial-card";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { ComponentProps, useRef } from "react";
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
  const containerRef = useRef(null);

  const marqueeVariants = {
    animate: {
      x: [0, -2000],
      transition: {
        x: {
          repeat: Infinity,
          repeatType: "loop",
          duration: 30,
          ease: "linear",
        },
      },
    },
  };

  return (
    <div
      className={cn(
        "mx-auto flex max-w-container flex-col items-center gap-4 text-center sm:gap-16",
        className
      )}
      {...props}
    >
      <div
        className="relative flex w-full flex-col items-center justify-center overflow-hidden"
        ref={containerRef}
      >
        <div className="group flex overflow-hidden p-2 [--gap:1rem] [gap:var(--gap)] flex-row">
          <motion.div
            className="flex shrink-0 justify-around [gap:var(--gap)] flex-row"
            variants={marqueeVariants}
            animate="animate"
          >
            {[...Array(4)].map((_, setIndex) =>
              testimonials.map((testimonial, i) => (
                <TestimonialCard key={`${setIndex}-${i}`} {...testimonial} />
              ))
            )}
          </motion.div>
        </div>
        <div className="pointer-events-none absolute inset-y-0 left-0 hidden w-1/3 bg-gradient-to-r dark:from-black from-[#f6f7f8] sm:block" />
        <div className="pointer-events-none absolute inset-y-0 right-0 hidden w-1/3 bg-gradient-to-l dark:from-black from-[#f6f7f8] sm:block" />
      </div>
    </div>
  );
}
