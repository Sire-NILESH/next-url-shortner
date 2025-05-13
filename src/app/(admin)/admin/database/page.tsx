import AdminPageHeader from "@/components/admin/admin-page-header";
import SeedOptionsForm from "@/components/admin/seed/seed-options-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AlertTriangle, CloudUpload } from "lucide-react";
import { Metadata } from "next";
import { adminModules } from "../page";

export const metadata: Metadata = {
  title: "Database Management - Admin | Shrinkify",
  description: "Database management tools for Shrinkify application",
};

const [adminUrlsPageModule] = adminModules.filter(
  (module) => module.id === "admin-db-mamangement"
);

export default function DatabasePage() {
  return (
    <>
      <AdminPageHeader className="mb-6" module={adminUrlsPageModule} />

      <div className="grid gap-6">
        <Card className="shadow-sm">
          <CardHeader>
            <div>
              <CardTitle>Seed Database</CardTitle>
            </div>
            <CardDescription>
              Populate the database with test data for development and testing
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-8">
            <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-md p-4 space-y-2">
              <h3 className="flex items-center gap-2 font-medium text-amber-800 dark:text-amber-300">
                <AlertTriangle className="size-5 text-amber-600 dark:text-amber-400" />
                Development Use Only
              </h3>

              <ul className="list-disc pl-4 space-y-1">
                <li className="text-sm text-amber-700 dark:text-amber-400">
                  This tool is intended for development purposes only.
                </li>
                <li className="text-sm text-amber-700 dark:text-amber-400">
                  Seeding the database will create test Users, URLs and Clicks
                </li>
              </ul>
            </div>

            <div className="bg-muted px-4 py-6 rounded-md space-y-2">
              <h3 className="font-medium flex items-center gap-2">
                <CloudUpload className="size-4" />
                Seed Options Form
              </h3>
              <p className="text-sm text-muted-foreground">
                Fill in the seed data option details to create the estimated
                amount of records for each.
              </p>
            </div>

            <div>
              <SeedOptionsForm />
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
