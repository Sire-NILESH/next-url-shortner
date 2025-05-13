"use client";

import { AtSign, Loader, LogOut, User } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Session } from "next-auth";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import useLogout from "./hooks/useLogout";

export function UserAvatarDropdown({ session }: { session: Session | null }) {
  const { logoutStatus, logoutUser } = useLogout();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="overflow-hidden rounded-full"
        >
          <UserAvatar
            userName={session?.user.name}
            imgUrl={session?.user.image}
          />
          <span className="sr-only">User dropdown settings</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem className="pointer-events-none select-text">
          <AtSign />
          {session?.user.email ? session?.user.email : "unknown email"}
        </DropdownMenuItem>
        <DropdownMenuItem className="pointer-events-none select-text">
          <User />
          {session?.user.name ? session?.user.name : "unknown user"}
        </DropdownMenuItem>
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
  );
}

export function UserAvatar({
  userName,
  imgUrl,
}: {
  userName?: string | null;
  imgUrl?: string | null;
}) {
  return (
    <Avatar className="rounded-none h-full w-full bg-primary text-primary-foreground">
      <AvatarImage
        src={imgUrl ? imgUrl : undefined}
        alt={userName ? userName : "user"}
      />
      <AvatarFallback className="bg-primary text-primary-foreground">
        {userName ? userName[0].toUpperCase() : "?"}
      </AvatarFallback>
    </Avatar>
  );
}
