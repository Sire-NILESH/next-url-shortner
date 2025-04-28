import AdminPageHeader from "@/components/admin/admin-page-header";
import { AdminUrlsTable } from "@/components/admin/urls/admin-urls-table";
import { UrlSearch } from "@/components/admin/urls/url-search";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { auth } from "@/server/auth";
import { Metadata } from "next";
import { redirect } from "next/navigation";
import { adminModules } from "../page";

export const metadata: Metadata = {
  title: "URL Management - Admin | Shrinkify",
  description: "Manage URLs in the Shrinkify application",
};

const [adminUrlsPageModule] = adminModules.filter(
  (module) => module.id === "admin-urls"
);

export default async function AdminUrlsPage({
  searchParams,
}: {
  searchParams: Promise<{
    page?: string;
    search?: string;
    sortBy?: string;
    sortOrder?: string;
    filter?: string;
  }>;
}) {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  if (session?.user.role !== "admin") {
    redirect("/dashboard");
  }

  const params = await searchParams;

  const search = params.search || "";

  return (
    <>
      <AdminPageHeader className="mb-6" module={adminUrlsPageModule} />

      <div className="">
        <Card className="shadow-sm">
          <CardHeader className="pb-3">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <CardTitle>URLs</CardTitle>
                <CardDescription>
                  View and manage all URLs in the system.
                </CardDescription>
              </div>
              <UrlSearch initialSearch={search} />
            </div>
          </CardHeader>
          <CardContent>
            <AdminUrlsTable />
          </CardContent>
        </Card>
      </div>
    </>
  );
}
