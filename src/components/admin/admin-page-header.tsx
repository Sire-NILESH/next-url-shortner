import { cn } from "@/lib/utils";
import React, { ComponentProps, JSX } from "react";

type Props = ComponentProps<"header"> & {
  module: {
    title: string;
    description: string;
    icon: JSX.Element;
    path: string;
    color: string;
    bgColor: string;
  };
};

const AdminPageHeader = ({ className, module, ...props }: Props) => {
  return (
    <header className={cn("", className)} {...props}>
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <div className={`p-2 rounded-md ${module.bgColor} ${module.color}`}>
            {module.icon}
          </div>
          <h1 className="text-xl font-semibold">{module.title}</h1>
        </div>
        <p className="text-sm text-muted-foreground">{module.description}</p>
      </div>
    </header>
  );
};

export default AdminPageHeader;
