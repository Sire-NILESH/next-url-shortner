import { useMutation } from "@tanstack/react-query";
import { signIn } from "next-auth/react";
import { toast } from "sonner";

async function loginWithGoogle() {
  return await signIn("google", { callbackUrl: "/dashboard" });
}

const useGoogleAuthLogin = () => {
  return useMutation({
    mutationFn: async () => {
      await loginWithGoogle();
    },

    onError: (error) => {
      console.error(error);
      toast.error("Google login failed", {
        description: error instanceof Error ? error.message : "Try again.",
      });
    },
  });
};

export default useGoogleAuthLogin;
