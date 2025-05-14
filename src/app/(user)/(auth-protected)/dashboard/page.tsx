import DashboardClient from "@/components/dashboard/dashboard-client";
import DashboardIntroCard from "@/components/dashboard/dashboard-intro-card";
import { authorizePageService } from "@/server/services/auth/authorize-page-sevice";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard | Shrinkify",
  description: "Dashboard page",
};

export default async function DashboardPage() {
  await authorizePageService();

  return (
    <div className="h-full px-4">
      <DashboardIntroCard
        pageTitle={"My Dashboard"}
        pageSubtitle="this is your shrinkify urls dashboard"
      />

      <DashboardClient />
    </div>
  );
}
