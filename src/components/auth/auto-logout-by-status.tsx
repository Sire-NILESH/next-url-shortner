"use client";

import { UserStatusTypeEnum } from "@/types/server/types";
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import useLogout from "./useLogout";

type AutoLogoutByStatusProps = {
  userStatus: UserStatusTypeEnum;
};

const AutoLogoutByStatus = ({ userStatus }: AutoLogoutByStatusProps) => {
  const session = useSession();
  const { logoutUser } = useLogout(false);

  useEffect(() => {
    if (userStatus === "inactive" && session.status === "authenticated") {
      logoutUser();
    }
  }, [logoutUser, session.status, userStatus]);

  return null;
};

export default AutoLogoutByStatus;
