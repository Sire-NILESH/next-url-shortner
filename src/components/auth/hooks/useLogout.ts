"use client";

import { useMutation } from "@tanstack/react-query";
import { signOut } from "next-auth/react";
import { toast } from "sonner";

async function logOutUser(redirect?: false | undefined) {
  return await signOut({ redirect });
}

function useLogout(redirect?: false | undefined) {
  const logoutMutation = useMutation({
    mutationFn: async () => {
      await logOutUser(redirect);
    },
    onSuccess: () => {
      toast.success("Logged out", {
        description: "You have been logged out successfully.",
      });
    },
    onError: (error) => {
      toast.error("Failed to Log out", {
        description:
          error instanceof Error
            ? error.message
            : "Something went wrong while logging you out",
      });
    },
  });

  return {
    logoutStatus: logoutMutation.status, // idle | loading | error | success
    logoutUser: logoutMutation.mutate, // Call this to trigger logout
    resetLogoutStatus: logoutMutation.reset, // Resets the mutation state
  };
}

export default useLogout;
