import { cn } from "@/lib/utils";
import React, { ComponentProps, useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Eye, EyeClosed } from "lucide-react";

type Props = ComponentProps<"input">;

const PasswordInput = ({ className, ...props }: Props) => {
  const [showPassword, setShowPassword] = useState(false);
  return (
    <div className={cn("relative", className)}>
      <Input
        placeholder="********"
        type={showPassword ? "text" : "password"}
        autoComplete="current-password"
        {...props}
      />
      <Button
        type="button"
        variant={"ghost"}
        size={"sm"}
        title={showPassword ? "Hide Password" : "Show Password"}
        aria-label={showPassword ? "Hide password" : "Show password"}
        onClick={() => setShowPassword((prev) => !prev)}
        className={"absolute right-2 top-1/2 -translate-y-1/2"}
      >
        {showPassword ? <EyeClosed /> : <Eye />}
      </Button>
    </div>
  );
};

export default PasswordInput;
