import DashboardClient from "@/components/dashboard/dashboard-client";
import DashboardIntroCard from "@/components/dashboard/dashboard-intro-card";
import { getUserUrls } from "@/server/actions/urls/get-user-urls";
import { auth } from "@/server/auth";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard | Shrinkify",
  description: "Dashboard page",
};

export default async function DashboardPage() {
  const session = await auth();

  // Get user's URLs
  const response = await getUserUrls(session?.user.id as string);
  const userUrls = response.success && response.data ? response.data : [];

  return (
    <div>
      <DashboardIntroCard
        pageTitle={"My Dashboard"}
        pageSubtitle="this is your shrinkify urls dashboard"
      />

      <DashboardClient userUrls={userUrls} />
    </div>
  );
}
