"use client";

import { cn } from "@/lib/utils";
import React, { ComponentProps } from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "../ui/breadcrumb";
import { usePathname } from "next/navigation";

type Props = ComponentProps<"div">;

const capitalizeFirstLetter = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

const AdminLayoutBreadCrumb = ({ className, ...props }: Props) => {
  const pathNames = usePathname().split("/").slice(1);

  return (
    <div className={cn(className)} {...props}>
      <Breadcrumb>
        <BreadcrumbList>
          {pathNames.map((path, index) => (
            <BreadcrumbItem
              key={index}
              className={cn(
                index < pathNames.length - 1 ? "" : "hidden md:block"
              )}
            >
              {index < pathNames.length - 1 ? (
                <>
                  <BreadcrumbLink href={`/${path}`}>
                    {capitalizeFirstLetter(path)}
                  </BreadcrumbLink>
                  <BreadcrumbSeparator className="hidden md:block" />
                </>
              ) : (
                <BreadcrumbItem>
                  <BreadcrumbPage>{capitalizeFirstLetter(path)}</BreadcrumbPage>
                </BreadcrumbItem>
              )}
            </BreadcrumbItem>
          ))}
        </BreadcrumbList>
      </Breadcrumb>
    </div>
  );
};

export default AdminLayoutBreadCrumb;
