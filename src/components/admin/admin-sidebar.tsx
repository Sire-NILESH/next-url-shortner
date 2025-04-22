"use client";

import * as React from "react";

import { AdminNavMain } from "@/components/admin/admin-nav-main";
import { NavUser } from "@/components/admin/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenuButton,
  SidebarRail,
} from "@/components/ui/sidebar";
import {
  adminDashboardNavItems,
  adminDashboardPlatformNavItems,
} from "@/site-config/nav-routes";
import { Home } from "lucide-react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import SkeletonWrapper from "../skeleton-wrapper";

const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const session = useSession();
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader className="mt-2">
        <Link href={"/"}>
          <SidebarMenuButton tooltip={"Home"}>
            <Home />
            <p className="brandText text-xl max-w-fit">Shrinkify</p>
          </SidebarMenuButton>
        </Link>
      </SidebarHeader>

      <SidebarContent>
        <AdminNavMain items={adminDashboardNavItems} groupLabel="Admin" />
        <AdminNavMain
          items={adminDashboardPlatformNavItems}
          groupLabel="Platform"
        />
      </SidebarContent>

      <SidebarFooter>
        <SkeletonWrapper isLoading={session.status === "loading"}>
          <NavUser session={session.data} />
        </SkeletonWrapper>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
