import { cn } from "@/lib/utils";
import Link from "next/link";
import React, { ComponentProps } from "react";

type Props = ComponentProps<"p">;

const Brand = ({ className, ...props }: Props) => {
  return (
    <Link href="/">
      <p
        className={cn("text-2xl font-bold brandText py-8", className)}
        {...props}
      >
        Shrinkify
      </p>
    </Link>
  );
};

export default Brand;
