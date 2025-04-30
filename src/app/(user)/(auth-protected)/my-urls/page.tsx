import DashboardIntroCard from "@/components/dashboard/dashboard-intro-card";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import UserUrlTable from "@/components/urls/user-urls-table/user-url-table";
import { authorizePageService } from "@/server/services/auth/authorize-page-sevice";
import { Link as LinkIcon } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "My URLs | Shrinkify",
  description: "Dashboard page",
};

export default async function MyUrlsPage() {
  await authorizePageService();

  return (
    <div className="h-full">
      <div>
        <DashboardIntroCard
          pageTitle={"My URLs"}
          pageSubtitle="here is all of your created shrinkify urls"
        />

        <div className="space-y-10">
          <Card className="shadow-sm border bg-background">
            <CardHeader className="flex flex-row items-center gap-3 px-4 md:px-6">
              <LinkIcon className="size-10 md:size-12 items-center rounded-lg p-2 text-blue-500 bg-blue-500/10" />
              <div>
                <CardTitle>Your URLs</CardTitle>
                <CardDescription>
                  Manage all your shrinkify URLs here.
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent className="px-4 md:px-6">
              <UserUrlTable />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
