import { UserSearch } from "@/components/admin/users/user-search";
import { UsersTable } from "@/components/admin/users/users-table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import AdminPageHeader from "@/components/admin/admin-page-header";
import { auth } from "@/server/auth";
import { Metadata } from "next";
import { redirect } from "next/navigation";
import { adminModules } from "../page";

export const metadata: Metadata = {
  title: "User Management | Admin | ShortLink",
  description: "Manage users in the ShortLink application",
};

const [adminUsersPageModule] = adminModules.filter(
  (module) => module.id === "admin-users"
);

export default async function UserManagementPage({
  searchParams,
}: {
  searchParams: Promise<{
    page?: string;
    search?: string;
    sortBy?: string;
    sortOrder?: string;
  }>;
}) {
  const session = await auth();

  // Redirect to login if not authenticated
  if (!session?.user) {
    redirect("/login");
  }

  // Redirect to dashboard if not an admin
  if (session.user.role !== "admin") {
    redirect("/dashboard");
  }

  // Parse search params
  const params = await searchParams;
  const search = params.search || "";

  return (
    <>
      <AdminPageHeader className="mb-6" module={adminUsersPageModule} />

      <div className="">
        <Card className="shadow-sm">
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <CardTitle>Users</CardTitle>
                <CardDescription>
                  View and manage all users in the system
                </CardDescription>
              </div>
              <UserSearch initialSearch={search} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <UsersTable />
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
