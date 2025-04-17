import React, { ComponentProps } from "react";
import { Card, CardContent, CardHeader } from "../ui/card";
import { cn } from "@/lib/utils";
import { UserAvatar } from "../auth/user-avatar";
import { auth } from "@/server/auth";
import { Separator } from "../ui/separator";
import Link from "next/link";
import { Cog } from "lucide-react";
import { buttonVariants } from "../ui/button";

type Props = ComponentProps<"div"> & {
  pageTitle: string;
  pageSubtitle: string;
};

const DashboardIntroCard = async ({
  className,
  pageTitle,
  pageSubtitle,
  ...props
}: Props) => {
  const session = await auth();

  const userName = session?.user.name;
  const userEmail = session?.user.email;
  const userImg = session?.user.image;

  return (
    <Card
      className={cn(
        "flex flex-col md:flex-row-reverse md:items-center mb-10",
        className
      )}
      {...props}
    >
      <CardHeader className="hidden md:block">
        <div className="flex items-center gap-3">
          <div className="space-y-0.5 text-right">
            <p className="text-sm font-medium">{userName}</p>
            <p className="text-muted-foreground text-xs">{userEmail}</p>
          </div>
          <UserAvatar
            className="size-10"
            userName={userName}
            imgUrl={userImg}
          />
        </div>
      </CardHeader>

      <CardContent className="flex-1 space-y-2">
        <div className="flex gap-4 lg:gap-6 items-center">
          <h1 className="text-3xl boldText !font-semibold">{pageTitle}</h1>

          {session && session.user.role === "admin" ? (
            <>
              <Separator orientation="vertical" className="min-h-6 !w-0.5" />
              <Link
                href="/admin"
                className={cn(
                  buttonVariants({ variant: "outline", size: "sm" }),
                  "shadow-none"
                )}
              >
                <Cog className="size-4 text-muted-foreground" />
                <p>Admin Tools</p>
              </Link>
            </>
          ) : null}
        </div>
        <p className="text-muted-foreground">
          Hi <span className="font-semibold">{userName}</span>, {pageSubtitle}
        </p>
      </CardContent>
    </Card>
  );
};

export default DashboardIntroCard;
