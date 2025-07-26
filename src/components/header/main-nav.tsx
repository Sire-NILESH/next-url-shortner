"use client";

import { cn } from "@/lib/utils";
import { homeNavRoutes } from "@/site-config/nav-routes";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ComponentProps } from "react";

type Props = ComponentProps<"nav"> & {};

const MainNav = ({ className, ...props }: Props) => {
  const pathname = usePathname();
  return (
    <nav
      className={cn(
        "flex items-center space-x-4 list-none text-base font-normal",
        className
      )}
      {...props}
    >
      {Object.values(homeNavRoutes).map((pathObj) => (
        <Link key={pathObj.id} href={pathObj.path}>
          <li
            className={cn(
              "flex items-center gap-1 hover:text-foreground text-muted-foreground",
              pathname === pathObj.path && "text-foreground"
            )}
          >
            {pathObj.icon}
            {pathObj.label}
          </li>
        </Link>
      ))}
    </nav>
  );
};

export default MainNav;
