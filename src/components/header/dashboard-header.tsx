import { cn } from "@/lib/utils";
import { ComponentProps } from "react";
import { ThemeToggle } from "../theme/theme-toggle";
import AuthUser from "./auth-user";
import Brand from "./brand";
import DashboardNav from "./dashboard-nav";
import { DashboardNavMobile } from "./dashboard-nav-mobile";

type Props = ComponentProps<"header">;

export function DashboardHeader({ className, ...props }: Props) {
  return (
    <header
      className={cn(
        "fixed top-0 left-1/2 -translate-x-1/2 z-50 w-full border-b border-border bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/10",
        className
      )}
      {...props}
    >
      <div className="max-w-5xl mx-2 md:mx-auto">
        <div className="flex h-16 items-center px-4 md:px-6 space-x-4 md:space-x-10">
          <Brand />

          <div className="flex flex-1">
            <div className="hidden md:block">
              <DashboardNav />
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <div className="hidden md:block">
              <ThemeToggle />
            </div>
            <AuthUser />
            <div className="block md:hidden">
              <DashboardNavMobile />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
