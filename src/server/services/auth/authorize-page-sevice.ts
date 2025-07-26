import "server-only";

import { redirect } from "next/navigation";
import { UserRoleTypeEnum } from "@/types/server/types";
import { Session } from "next-auth";
import getUserSession from "./getUserSession";

type AuthorizeOptions = {
  requireUserId?: string;
  allowedRoles?: UserRoleTypeEnum[];
  allowOverrideRole?: UserRoleTypeEnum;
};

export async function authorizePageService({
  requireUserId,
  allowedRoles,
  allowOverrideRole,
}: AuthorizeOptions = {}): Promise<Session> {
  const session = await getUserSession();

  if (!session?.user) {
    redirect("/login");
  }

  const { user } = session;

  // UserId check with override
  if (
    requireUserId &&
    user.id !== requireUserId &&
    user.role !== allowOverrideRole
  ) {
    redirect("/");
  }

  // Role check
  if (allowedRoles && (!user.role || !allowedRoles.includes(user.role))) {
    redirect("/");
  }

  return session;
}
