"use client";

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { AdminDashboardNavItem } from "@/site-config/nav-routes";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function AdminNavMain({
  items,
  groupLabel,
}: {
  groupLabel: string;
  items: AdminDashboardNavItem[];
}) {
  const pathname = usePathname();

  const isActive = (item: AdminDashboardNavItem) => {
    if (item.exact) {
      return pathname === item.path;
    }

    if (
      item.path === "/admin/urls" &&
      pathname.includes("/admin/urls/flagged")
    ) {
      return false;
    }

    return pathname === item.path || pathname.startsWith(`${item.path}/`);
  };

  return (
    <SidebarGroup>
      <SidebarGroupLabel>{groupLabel}</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => (
          <SidebarMenuItem key={item.label}>
            <Link href={item.path}>
              <SidebarMenuButton tooltip={item.label} isActive={isActive(item)}>
                {item.icon && item.icon}
                <span>{item.label}</span>
              </SidebarMenuButton>
            </Link>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
