"use client";

import { loginSchema } from "./schema";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { signIn } from "next-auth/react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

type LoginFormValues = z.infer<typeof loginSchema>;

async function loginUser(data: LoginFormValues) {
  const result = await signIn("credentials", {
    email: data.email,
    password: data.password,
    redirect: false,
  });

  if (result?.error) {
    throw new Error("Invalid email or password");
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
      toast.error("Invalid email or password", {
        description: error instanceof Error ? error.message : "Try again.",
      });
    },
  });
};

export default useLogin;
