import { cn } from "@/lib/utils";
import React, { ComponentProps } from "react";

type Props = ComponentProps<"div"> & {};

const TemplateComponent = ({ className, ...props }: Props) => {
  return (
    <div className={cn("", className)} {...props}>
      TemplateComponent
    </div>
  );
};

export default TemplateComponent;
