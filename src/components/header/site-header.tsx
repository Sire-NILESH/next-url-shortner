import { cn } from "@/lib/utils";
import { ComponentProps } from "react";
import { ThemeToggle } from "../theme-toggle";
import AuthUser from "./auth-user";
import Brand from "./brand";
import MainNav from "./main-nav";
import { MobileNav } from "./mobile-nav";

type Props = ComponentProps<"header">;

export function SiteHeader({ className, ...props }: Props) {
  return (
    <header
      className={cn(
        "fixed top-0 left-1/2 -translate-x-1/2 z-50 w-full border-b border-border bg-background/60 backdrop-blur supports-[backdrop-filter]:bg-background/10",
        className
      )}
      {...props}
    >
      <div className="max-w-5xl mx-2 md:mx-auto">
        <div className="flex h-20 items-center px-4 md:px-6 space-x-4 md:space-x-10">
          <Brand />

          {/* <Separator orientation="vertical" className="my-4 border-1" /> */}

          <div className="flex flex-1">
            <div className="hidden md:block">
              <MainNav />
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <ThemeToggle />
            <AuthUser />
            <div className="block md:hidden">
              <MobileNav />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
