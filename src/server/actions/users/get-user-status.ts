"use server";

import { auth } from "@/server/auth";
import { db, eq } from "@/server/db";
import { users } from "@/server/db/schema";
import { ApiResponse, UserStatusTypeEnum } from "@/types/server/types";
import { redirect } from "next/navigation";

export async function getUserStatus(): Promise<
  ApiResponse<UserStatusTypeEnum>
> {
  try {
    const session = await auth();

    if (!session || !session.user) redirect("/login");

    const userId = session.user.id;

    const [user] = await db.select().from(users).where(eq(users.id, userId));

    if (!user) redirect("/login");

    return {
      success: true,
      data: user.status,
    };
  } catch (error) {
    // rethrow if it's a NEXT_REDIRECT error
    // redirect() throws an error with message === "NEXT_REDIRECT" and handled by NextJS and that's how redirect flows work internally.
    if (error instanceof Error && error?.message === "NEXT_REDIRECT") {
      console.error({
        "redirecting user from getUserStatus for bad status": {
          message: error.message,
        },
      });
      throw error;
    }

    console.error("Error in getUserStatus", error);
    return {
      success: false,
      error: "Something went wrong.",
    };
  }
}
