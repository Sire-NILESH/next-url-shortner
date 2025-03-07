import { cn } from "@/lib/utils";
import { ComponentProps } from "react";
import { ThemeToggle } from "../theme-toggle";
import AuthUser from "./auth-user";
import Brand from "./brand";

type Props = ComponentProps<"header">;

export function SiteHeader({ className, ...props }: Props) {
  return (
    <header
      className={cn(
        "absolute top-4 left-1/2 -translate-x-1/2 z-50 max-w-2xl w-full",
        className
      )}
      {...props}
    >
      <div className="mx-2 md:mx-0 rounded-full border border-border bg-background/60 backdrop-blur supports-[backdrop-filter]:bg-background/10">
        <div className="flex h-20 items-center px-4 md:px-6">
          <Brand />

          <div className="flex flex-1 items-center space-x-2 justify-end">
            <nav className="flex items-center space-x-2">
              <ThemeToggle />
              <AuthUser />
            </nav>
          </div>
        </div>
      </div>
    </header>
  );
}
