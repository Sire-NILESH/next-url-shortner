import React from "react";
import {
  Section,
  SectionTitle,
  SectionDescription,
  SectionProps,
} from "@/components/sections/Section";
import { FeaturesList } from "@/components/sections/features/features-list";
import { cn } from "@/lib/utils";
import Link from "next/link";

type Props = SectionProps & {};

const FeatuesSection = ({ className, ...props }: Props) => {
  return (
    <Section className={cn("bg-transparent", className)} {...props}>
      <SectionTitle className="sm:text-center">
        {"Here's what's on the table"}
      </SectionTitle>
      <SectionDescription className="sm:text-center">
        A plethora of features and all of these available to you at a low low{" "}
        price of a{" "}
        <Link href="/register" className="text-blue-600">
          free account!
        </Link>
        . And the catch? there is no none!
      </SectionDescription>

      <FeaturesList className="w-full" />
    </Section>
  );
};

export default FeatuesSection;
