"use client";

import { AtSign, Loader, LogOut, User } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useSession } from "next-auth/react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import useLogout from "./useLogout";

export function UserAvatarDropdown() {
  const session = useSession();
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
            userName={session.data?.user.name}
            imgUrl={session.data?.user.image}
          />
          <span className="sr-only">User dropdown settings</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem className="pointer-events-none select-text">
          <AtSign />
          {session.data?.user.email
            ? session.data?.user.email
            : "unknown email"}
        </DropdownMenuItem>
        <DropdownMenuItem className="pointer-events-none select-text">
          <User />
          {session.data?.user.name ? session.data?.user.name : "unknown user"}
        </DropdownMenuItem>
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
