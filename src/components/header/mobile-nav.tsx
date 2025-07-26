"use client";

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { mobileHomeNavRoutes } from "@/site-config/nav-routes";
import { Menu } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import ThemeSwitch from "../theme/theme-switch";
import Brand from "./brand";

export function MobileNav() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 md:hidden"
        >
          <Menu className="size-5" />
          <span className="sr-only">Toggle Menu</span>
        </Button>
      </SheetTrigger>

      <SheetContent side="left" className="pt-14 space-y-6">
        <SheetTitle>
          <div className="pl-4">
            <Brand className="text-2xl sm:text-4xl pb-2 max-w-fit" />
            <p className="text-sm sm:text-base text-muted-foreground">
              {"Simply shrinkify your URLs with ease"}
            </p>
            <p className="sr-only">Navigation menu</p>
          </div>
        </SheetTitle>

        <ScrollArea className="my-4 h-[calc(100vh-8rem)] px-4">
          <nav className="flex flex-col text-lg space-y-2">
            {Object.values(mobileHomeNavRoutes).map((pathObj) => (
              <Link key={pathObj.id} href={pathObj.path}>
                <li
                  className={cn(
                    "flex items-center gap-2 hover:text-foreground text-sm sm:text-base text-muted-foreground hover:bg-secondary p-2 rounded-lg",
                    pathname === pathObj.path &&
                      "text-primary-foreground bg-primary font-medium"
                  )}
                >
                  {pathObj.icon}
                  {pathObj.label}
                </li>
              </Link>
            ))}
          </nav>
        </ScrollArea>

        <SheetFooter className="pb-0 mb-4 space-y-4">
          <ThemeSwitch className="mx-auto" />
          <p className="pl-2 text-sm text-muted-foreground text-center">
            © {new Date().getFullYear()} Sire inc. All rights reserved.
          </p>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
