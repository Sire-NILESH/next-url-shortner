"use client";

import { cn } from "@/lib/utils";
import { useSession } from "next-auth/react";
import React, { ComponentProps } from "react";
import { UserAvatarDropdown } from "../auth/user-avatar-dropdown";
import Link from "next/link";
import { buttonVariants } from "../ui/button";
import { Skeleton } from "../ui/skeleton";

type Props = ComponentProps<"div">;

const AuthUser = ({ className, ...props }: Props) => {
  const session = useSession();

  return (
    <div className={cn("", className)} {...props}>
      {session.status === "loading" ? (
        <Skeleton className="size-9 rounded-full" />
      ) : session.status === "authenticated" ? (
        <UserAvatarDropdown />
      ) : (
        <Link
          href={"/login"}
          className={buttonVariants({ variant: "default" })}
        >
          Login
        </Link>
      )}
    </div>
  );
};

export default AuthUser;
