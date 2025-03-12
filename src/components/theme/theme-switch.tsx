"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import React, { ComponentProps } from "react";
import { Switch } from "../ui/switch";
import { Label } from "../ui/label";
import { cn } from "@/lib/utils";

type Props = ComponentProps<"div">;

const ThemeSwitch = ({ className, ...props }: Props) => {
  const { setTheme, theme } = useTheme();

  const themeSwitchHandler = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
    if (theme === "dark") {
      return true;
    } else return false;
  };
  return (
    <div className={cn("flex items-center space-x-2", className)} {...props}>
      <Sun className="size-4" />
      <Switch
        id="theme-mode"
        checked={theme === "dark"}
        onCheckedChange={themeSwitchHandler}
      />
      <Moon className="size-4" />
      <Label htmlFor="theme-mode" className="sr-only">
        Toggle theme
      </Label>
    </div>
  );
};

export default ThemeSwitch;
