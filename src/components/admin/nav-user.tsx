"use client";

import { EllipsisVertical, Loader, LogOut } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { Session } from "next-auth";
import useLogout from "../auth/useLogout";
import { UserAvatar } from "../auth/user-avatar-dropdown";

export function NavUser({ session }: { session: Session | null }) {
  const { isMobile } = useSidebar();
  const { logoutStatus, logoutUser } = useLogout();
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <div className="rounded-full overflow-hidden size-8">
                <UserAvatar
                  userName={session?.user.name}
                  imgUrl={session?.user.image}
                />
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">
                  {session?.user.name}
                </span>
                <span className="truncate text-xs">{session?.user.email}</span>
              </div>
              <EllipsisVertical className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <div className="rounded-full overflow-hidden size-8">
                  <UserAvatar
                    userName={session?.user.name}
                    imgUrl={session?.user.image}
                  />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">
                    {session?.user.name}
                  </span>
                  <span className="truncate text-xs">
                    {session?.user.email}
                  </span>
                </div>
              </div>
            </DropdownMenuLabel>

            <DropdownMenuSeparator />

            <DropdownMenuItem
              disabled={logoutStatus === "pending"}
              onClick={() => logoutUser()}
            >
              {logoutStatus === "pending" ? (
                <Loader className="animate-spin" />
              ) : (
                <LogOut />
              )}
              {logoutStatus === "pending" ? "Logging out..." : "Logout"}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
