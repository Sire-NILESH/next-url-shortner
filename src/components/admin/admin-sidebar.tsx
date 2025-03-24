"use client";

import {
  AlertTriangleIcon,
  AudioWaveform,
  Command,
  DatabaseIcon,
  GalleryVerticalEnd,
  LayoutDashboardIcon,
  Link2Icon,
  LinkIcon,
  UsersIcon,
} from "lucide-react";
import * as React from "react";

import { AdminNavMain } from "@/components/admin/admin-nav-main";
import { NavUser } from "@/components/admin/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarRail,
} from "@/components/ui/sidebar";
import { AdminDashboardNavItem } from "@/site-config/nav-routes";

const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },

  teams: [
    {
      name: "Acme Inc",
      logo: GalleryVerticalEnd,
      plan: "Enterprise",
    },
    {
      name: "Acme Corp.",
      logo: AudioWaveform,
      plan: "Startup",
    },
    {
      name: "Evil Corp.",
      logo: Command,
      plan: "Free",
    },
  ],
};

const adminNavItems: AdminDashboardNavItem[] = [
  {
    label: "Overview",
    path: "/admin",
    icon: <LayoutDashboardIcon />,
    exact: true,
  },
  {
    label: "URLs",
    path: "/admin/urls",
    icon: <Link2Icon />,
    exact: true,
  },
  {
    label: "Flagged URLs",
    path: "/admin/urls/flagged",
    icon: <AlertTriangleIcon />,
    exact: true,
  },
  {
    label: "Users",
    path: "/admin/users",
    icon: <UsersIcon />,
    exact: true,
  },
  {
    label: "Database",
    path: "/admin/database",
    icon: <DatabaseIcon />,
    exact: true,
  },
];

const platformNavItems: AdminDashboardNavItem[] = [
  {
    label: "Dashboard",
    path: "/dashboard",
    icon: <LayoutDashboardIcon />,
    exact: true,
  },
  {
    label: "My URLs",
    path: "/my-urls",
    icon: <LinkIcon />,
    exact: true,
  },
];

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      {/* <SidebarHeader>
        <div className="mt-2">
          <Brand className="text-3xl max-w-fit" />
        </div>
      </SidebarHeader> */}

      <SidebarContent>
        <AdminNavMain items={adminNavItems} groupLabel="Admin" />
        <AdminNavMain items={platformNavItems} groupLabel="Platform" />
      </SidebarContent>

      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
