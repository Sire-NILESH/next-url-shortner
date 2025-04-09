import { auth } from "@/server/auth";
import { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Analytics - Admin | Shrinkify",
  description: "View analytics of the Shrinkify application",
};

export default async function AdminAnalyticsPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  if (session?.user.role !== "admin") {
    redirect("/dashboard");
  }

  return <></>;
}
