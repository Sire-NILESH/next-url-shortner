import { authorizePageService } from "@/server/services/auth/authorize-page-sevice";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Analytics - Admin | Shrinkify",
  description: "View analytics of the Shrinkify application",
};

export default async function AdminAnalyticsPage() {
  await authorizePageService({ allowedRoles: ["admin"] });

  return <></>;
}
