"use client";

import { AuthProvider } from "@/components/providers/auth-provider";
import QueryProvider from "@/components/providers/query-provider";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { ToastProvider } from "@/components/providers/toast-provider";
import { PropsWithChildren } from "react";
import "./globals.css";

type Props = PropsWithChildren;

const Providers = ({ children }: Props) => {
  return (
    <>
      <ThemeProvider>
        <QueryProvider>
          <AuthProvider>
            <ToastProvider />
            {children}
          </AuthProvider>
        </QueryProvider>
      </ThemeProvider>
    </>
  );
};

export default Providers;
