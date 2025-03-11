import { cn } from "@/lib/utils";
import { LaptopMinimal } from "lucide-react";
import { ComponentProps } from "react";

type FeaturesListProps = ComponentProps<"div"> & {};

const features = [
  {
    title: "Built for developers",
    description:
      "Built for engineers, developers, dreamers, thinkers and doers.",
    icon: <LaptopMinimal />,
  },
  {
    title: "Ease of use",
    description:
      "It's as easy as using an Apple, and as expensive as buying one.",
    icon: <LaptopMinimal />,
  },
  {
    title: "Pricing like no other",
    description:
      "Our prices are best in the market. No cap, no lock, no credit card required.",
    icon: <LaptopMinimal />,
  },
  {
    title: "100% Uptime guarantee",
    description: "We just cannot be taken down by anyone.",
    icon: <LaptopMinimal />,
  },
  {
    title: "Multi-tenant Architecture",
    description: "You can simply share passwords instead of buying new seats",
    icon: <LaptopMinimal />,
  },
  {
    title: "24/7 Customer Support",
    description:
      "We are available a 100% of the time. Atleast our AI Agents are.",
    icon: <LaptopMinimal />,
  },
  {
    title: "Money back guarantee",
    description: "If you donot like EveryAI, we will convince you to like us.",
    icon: <LaptopMinimal />,
  },
  {
    title: "And everything else",
    description: "I just ran out of copy ideas. Accept my sincere apologies",
    icon: <LaptopMinimal />,
  },
];

export function FeaturesList({ className, ...props }: FeaturesListProps) {
  return (
    <div
      className={cn(
        "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4  relative z-10 py-10 max-w-7xl mx-auto",
        className
      )}
      {...props}
    >
      {features.map((feature, index) => (
        <Feature key={feature.title} {...feature} index={index} />
      ))}
    </div>
  );
}

const Feature = ({
  title,
  description,
  icon,
  index,
}: {
  title: string;
  description: string;
  icon: React.ReactNode;
  index: number;
}) => {
  return (
    <div
      className={cn(
        "flex flex-col lg:border-r  py-10 relative group/feature dark:border-neutral-800",
        (index === 0 || index === 4) && "lg:border-l dark:border-neutral-800",
        index < 4 && "lg:border-b dark:border-neutral-800"
      )}
    >
      {index < 4 && (
        <div className="opacity-0 group-hover/feature:opacity-100 transition duration-200 absolute inset-0 h-full w-full bg-gradient-to-t from-neutral-100 dark:from-neutral-800 to-transparent pointer-events-none" />
      )}
      {index >= 4 && (
        <div className="opacity-0 group-hover/feature:opacity-100 transition duration-200 absolute inset-0 h-full w-full bg-gradient-to-b from-neutral-100 dark:from-neutral-800 to-transparent pointer-events-none" />
      )}
      <div className="mb-4 relative z-10 px-10 text-muted-foreground">
        {icon}
      </div>
      <div className="text-lg font-bold mb-2 relative z-10 px-10">
        <div className="absolute left-0 inset-y-0 h-6 group-hover/feature:h-8 w-1 rounded-tr-full rounded-br-full bg-neutral-300 dark:bg-neutral-700 group-hover/feature:bg-blue-500 transition-all duration-200 origin-center" />
        <span className="group-hover/feature:translate-x-2 transition duration-200 inline-block text-foreground">
          {title}
        </span>
      </div>
      <p className="text-muted-foreground md:max-w-xs md:text-sm relative z-10 px-10">
        {description}
      </p>
    </div>
  );
};
