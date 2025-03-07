import { AuthProvider } from "@/components/providers/auth-provider";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { ToastProvider } from "@/components/providers/toast-provider";
import { cn } from "@/lib/utils";
import { ComponentProps } from "react";
import "./globals.css";

type Props = ComponentProps<"div">;

const Providers = ({ className, children, ...props }: Props) => {
  return (
    <div className={cn("", className)} {...props}>
      <ThemeProvider>
        <AuthProvider>
          <ToastProvider />
          {children}
        </AuthProvider>
      </ThemeProvider>
    </div>
  );
};

export default Providers;
