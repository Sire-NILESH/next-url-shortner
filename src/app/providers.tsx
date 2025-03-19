"use client";

import { AuthProvider } from "@/components/providers/auth-provider";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { ToastProvider } from "@/components/providers/toast-provider";
import { cn } from "@/lib/utils";
import { ComponentProps, useState } from "react";
import "./globals.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

type Props = ComponentProps<"div">;

const Providers = ({ className, children, ...props }: Props) => {
  // Create a client instance for each request to avoid sharing state between users
  const [queryClient] = useState(() => new QueryClient());
  return (
    <div className={cn("", className)} {...props}>
      <ThemeProvider>
        <QueryClientProvider client={queryClient}>
          <AuthProvider>
            <ToastProvider />
            {children}
          </AuthProvider>
        </QueryClientProvider>
      </ThemeProvider>
    </div>
  );
};

export default Providers;
