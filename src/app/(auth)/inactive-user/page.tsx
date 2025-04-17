"use client";

import useLogout from "@/components/auth/useLogout";
import { useSession } from "next-auth/react";
import { useEffect } from "react";

const InactiveUserPage = () => {
  const session = useSession();
  const { logoutUser } = useLogout(false);

  useEffect(() => {
    if (session.status === "authenticated") {
      logoutUser();
    }
  }, [logoutUser, session.status]);

  return (
    <div className="my-6 md:my-20 flex flex-1 flex-col items-center justify-center">
      <div className="space-y-2 text-center max-w-2xl">
        <h2 className="font-semibold text-2xl">Your Account is inactive</h2>
        <p className="text-lg text-muted-foreground">
          Your account is currently inactive, please contact support to enquire
          further.
        </p>
      </div>
    </div>
  );
};

export default InactiveUserPage;
