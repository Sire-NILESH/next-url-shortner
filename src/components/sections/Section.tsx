"use client";
import { cn } from "@/lib/utils";
import { ComponentProps } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { useIsMobile } from "@/hooks/useMobile";

export type SectionProps = ComponentProps<"section">;
type TitleProps = ComponentProps<"p">;
type DescriptionProps = ComponentProps<"p">;
type ContentProps = ComponentProps<"div">;

const Section = ({ className, children }: SectionProps) => {
  const ref = useRef(null);
  const isMobile = useIsMobile();

  // Use scroll-based animations which are generally smoother than InView
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.1, 0.3], [0.6, 1, 1]);

  // Mobile devices get simpler animations with better performance
  if (isMobile) {
    return (
      <section
        ref={ref}
        className={cn(
          "bg-background text-foreground py-4 sm:py-12 px-0",
          className
        )}
      >
        <div className="flex flex-col sm:items-center gap-4 px-4 sm:gap-8">
          {children}
        </div>
      </section>
    );
  }

  // Desktop gets the richer animations
  return (
    <motion.section
      ref={ref}
      className={cn(
        "bg-background text-foreground py-4 sm:py-12 px-0",
        className
      )}
      style={{ opacity }}
    >
      <div className="flex flex-col sm:items-center gap-4 px-4 sm:gap-8">
        {children}
      </div>
    </motion.section>
  );
};

const SectionTitle = ({ className, children }: TitleProps) => {
  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <h2
        className={cn(
          "max-w-[720px] text-4xl boldText leading-tight sm:text-5xl sm:leading-tight",
          className
        )}
      >
        {children}
      </h2>
    );
  }

  return (
    <motion.h2
      className={cn(
        "max-w-[720px] text-4xl boldText leading-tight sm:text-5xl sm:leading-tight",
        className
      )}
      initial={{ opacity: 0.6, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      // viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      {children}
    </motion.h2>
  );
};

const SectionDescription = ({ className, children }: DescriptionProps) => {
  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <p
        className={cn(
          "-mt-3 sm:mt-0 text-base md:text-lg max-w-[750px] leading-relaxed tracking-tight text-muted-foreground",
          className
        )}
      >
        {children}
      </p>
    );
  }

  return (
    <motion.p
      className={cn(
        "-mt-3 sm:mt-0 text-base md:text-lg max-w-[750px] leading-relaxed tracking-tight text-muted-foreground",
        className
      )}
      initial={{ opacity: 0.6, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      // viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      {children}
    </motion.p>
  );
};

const SectionContent = ({ className, children }: ContentProps) => {
  const isMobile = useIsMobile();

  if (isMobile) {
    return <div className={cn("w-full", className)}>{children}</div>;
  }

  return (
    <motion.div
      className={cn("w-full", className)}
      initial={{ opacity: 0.6, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      // viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      {children}
    </motion.div>
  );
};

export { Section, SectionTitle, SectionDescription, SectionContent };
