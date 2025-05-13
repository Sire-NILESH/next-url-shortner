"use client";

import { loginSchema } from "../schema";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { signIn } from "next-auth/react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import {
  AuthErrorCodes,
  AuthErrorKey,
} from "@/lib/auth/errors/auth-error-codes";

type LoginFormValues = z.infer<typeof loginSchema>;

async function loginUser(data: LoginFormValues) {
  const result = await signIn("credentials", {
    email: data.email,
    password: data.password,
    redirect: false,
  });

  if (result?.error) {
    if (result.error === "CredentialsSignin" && result.code) {
      const message = AuthErrorCodes[result.code as AuthErrorKey].message;
      throw new Error(message);
    }
    throw new Error("Could not log you in");
  }
}

const useLogin = () => {
  const router = useRouter();

  // Login Mutation with React Query
  return useMutation({
    mutationFn: async (data: LoginFormValues) => {
      await loginUser(data);
    },
    onSuccess: () => {
      toast.success("Logged in successfully", {
        description: "You have been logged in successfully.",
      });

      router.push("/dashboard");
      router.refresh();
    },
    onError: (error) => {
      toast.error("Login failed", {
        description: error instanceof Error ? error.message : "Try again.",
      });
    },
  });
};

export default useLogin;
