import { SiteFooter } from "@/components/footer/site-footer";
import { GridBackgroundLayout } from "@/components/backgrounds/grid-background";
import { SiteHeader } from "@/components/header/site-header";
import { ReactNode } from "react";

interface AuthLayoutProps {
  children: ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <>
      <SiteHeader />
      <div className="flex flex-col min-h-screen items-center justify-center">
        <GridBackgroundLayout>
          <div className="container px-2">{children}</div>
        </GridBackgroundLayout>
      </div>
      <SiteFooter />
    </>
  );
}
