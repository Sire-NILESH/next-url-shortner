import { GridBackgroundLayout } from "@/components/backgrounds/grid-background";
import FooterCompact from "@/components/footer/footer-compact";
import { DashboardHeader } from "@/components/header/dashboard-header";
import { authorizePageService } from "@/server/services/auth/authorize-page-sevice";
import { ReactNode } from "react";

interface DashboardLayoutProps {
  children: ReactNode;
}

export default async function DashboardLayout({
  children,
}: DashboardLayoutProps) {
  await authorizePageService();

  return (
    <>
      <DashboardHeader />
      <div className="flex flex-col min-h-screen">
        <GridBackgroundLayout>
          <div className="container px-2 md:p-0 my-32">{children}</div>
        </GridBackgroundLayout>
      </div>
      <FooterCompact />
    </>
  );
}
