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

const capitalizeFirstLetter = (str: string): string =>
  str.charAt(0).toUpperCase() + str.slice(1);

const AdminLayoutBreadCrumb = ({ className, ...props }: Props) => {
  const pathNames = usePathname().split("/").slice(1);

  let accumulatedPath = "";

  return (
    <div className={cn(className)} {...props}>
      <Breadcrumb>
        <BreadcrumbList>
          {pathNames.map((path, index) => {
            accumulatedPath += `/${path}`;

            return (
              <BreadcrumbItem key={index}>
                {index < pathNames.length - 1 ? (
                  <>
                    <BreadcrumbLink href={accumulatedPath}>
                      {capitalizeFirstLetter(path)}
                    </BreadcrumbLink>
                    <BreadcrumbSeparator />
                  </>
                ) : (
                  <BreadcrumbPage>{capitalizeFirstLetter(path)}</BreadcrumbPage>
                )}
              </BreadcrumbItem>
            );
          })}
        </BreadcrumbList>
      </Breadcrumb>
    </div>
  );
};

export default AdminLayoutBreadCrumb;
