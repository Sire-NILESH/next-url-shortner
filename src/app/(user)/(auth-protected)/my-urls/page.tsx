import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import UserUrlsTable from "@/components/urls/user-urls-table";
import { getUserUrls } from "@/server/actions/urls/get-user-urls";
import { auth } from "@/server/auth";
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "My URLs | Shrinkify",
  description: "Dashboard page",
};

export default async function MyUrlsPage() {
  const session = await auth();

  // Get user's URLs
  const response = await getUserUrls(session?.user.id as string);
  const userUrls = response.success && response.data ? response.data : [];

  return (
    <div>
      <h1 className="text-3xl boldText !font-semibold uppercase mb-8 text-center">
        My Urls
      </h1>

      <div className="space-y-10">
        <Card className="shadow-sm border bg-background">
          <CardHeader className="px-4 md:px-6">
            <CardTitle>Your URLs</CardTitle>
            <CardDescription>
              Manage all your shrinkify URLs here.
            </CardDescription>
          </CardHeader>
          <CardContent className="px-4 md:px-6">
            <UserUrlsTable urls={userUrls} />
          </CardContent>
        </Card>

        {process.env.NODE_ENV === "development" &&
          session?.user.role === "admin" && (
            <div className="text-center mt-4">
              <Link
                href={"/admin"}
                className="text-sm text-muted-foreground hover:text-primary underline"
              >
                Admin Tools
              </Link>
            </div>
          )}
      </div>
    </div>
  );
}
