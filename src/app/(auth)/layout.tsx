import { GridBackgroundLayout } from "@/components/grid-background";
import { SiteHeader } from "@/components/header/site-header";
import { ReactNode } from "react";

interface AuthLayoutProps {
  children: ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="flex flex-col min-h-screen items-center justify-center">
      <SiteHeader />
      <GridBackgroundLayout>
        <div className="container px-2 py-16 md:pt-24">{children}</div>
      </GridBackgroundLayout>
    </div>
  );
}
