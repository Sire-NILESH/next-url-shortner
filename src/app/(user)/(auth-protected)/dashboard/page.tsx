import DashboardClient from "@/components/dashboard/dashboard-client";
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
      <h1 className="text-3xl boldText !font-semibold uppercase mb-8 text-center">
        My Dashboard
      </h1>

      <DashboardClient userUrls={userUrls} />
    </div>
  );
}
