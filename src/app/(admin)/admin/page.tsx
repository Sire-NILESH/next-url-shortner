import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getUsersByProviderOverTime } from "@/server/actions/admin/users/get-users-by-provider-over-time";
import {
  AlertTriangle,
  ArrowRight,
  ChartSpline,
  Database,
  Link2Icon,
  Users,
} from "lucide-react";
import { Metadata } from "next";
import Link from "next/link";
import { JSX } from "react";

export const metadata: Metadata = {
  title: "Admin-Dashboard | Shrinkify",
  description: "Admin dashboard for Shrinkify",
};

type AdminModuleId =
  | "admin-analytics"
  | "admin-urls"
  | "admin-flagged-urls"
  | "admin-users"
  | "admin-db-mamangement";

type AdminModule = {
  id: AdminModuleId;
  title: string;
  description: string;
  icon: JSX.Element;
  path: string;
  color: string;
  bgColor: string;
};

export const adminModules: AdminModule[] = [
  {
    id: "admin-analytics",
    title: "Analytics",
    description: "Visualise analytics of the application",
    icon: <ChartSpline className="size-5" />,
    path: "/admin/analytics",
    color: "text-blue-500",
    bgColor: "bg-blue-100 dark:bg-blue-900/20",
  },
  {
    id: "admin-urls",
    title: "URL Management",
    description: "View, edit, and manage all shortened URLs",
    icon: <Link2Icon className="size-5" />,
    path: "/admin/urls",
    color: "text-blue-500",
    bgColor: "bg-blue-100 dark:bg-blue-900/20",
  },
  {
    id: "admin-flagged-urls",
    title: "Flagged URLs",
    description: "Review and moderate flagged URLs",
    icon: <AlertTriangle className="size-5" />,
    path: "/admin/urls/flagged",
    color: "text-yellow-500",
    bgColor: "bg-yellow-100 dark:bg-yellow-900/20",
  },
  {
    id: "admin-users",
    title: "User Management",
    description: "Manage user accounts and permissions",
    icon: <Users className="size-5" />,
    path: "/admin/users",
    color: "text-orange-500",
    bgColor: "bg-orange-100 dark:bg-orange-900/20",
  },
  {
    id: "admin-db-mamangement",
    title: "Database Management",
    description: "Seed and manage database data",
    icon: <Database className="size-5" />,
    path: "/admin/database",
    color: "text-purple-500",
    bgColor: "bg-purple-100 dark:bg-purple-900/20",
  },
];

export default async function AdminPage() {
  // TODO: DELETE LATER
  const res = await getUsersByProviderOverTime({
    timeRange: "30D",
  });
  console.log(res);

  return (
    <>
      <div className="grid gap-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-3">
          {adminModules.map((module) => (
            <Card key={module.path} className="overflow-hidden shadow-none">
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2">
                  <div
                    className={`p-2 rounded-md ${module.bgColor} ${module.color}`}
                  >
                    {module.icon}
                  </div>
                  <CardTitle className="text-xl">{module.title}</CardTitle>
                </div>
                <CardDescription>{module.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <Link href={module.path}>
                  <Button
                    variant={"outline"}
                    className="w-full justify-between group"
                  >
                    Go to {module.title}
                    <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </>
  );
}
