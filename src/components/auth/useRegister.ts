"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { z } from "zod";
import { registerSchema } from "./schema";
import { registerUser } from "@/server/actions/auth/register";

type RegisterFormValues = z.infer<typeof registerSchema>;

const useRegister = () => {
  const router = useRouter();

  return useMutation({
    mutationFn: async (data: RegisterFormValues) => {
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("email", data.email);
      formData.append("password", data.password);

      return registerUser(formData);
    },
    onSuccess: (response) => {
      if (!response.success) {
        toast.error(response.error || "An error occurred. Please try again.");
        return;
      }

      toast.success("Account created successfully", {
        description: "You have been registered successfully. Please sign in.",
      });

      router.push("/login?registered=true");
    },
    onError: () => {
      toast.error("An error occurred. Please try again.");
    },
  });
};

export default useRegister;
