"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "../ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import GoogleLoginIcon from "./google-login-icon";
import { loginSchema } from "./schema";
import useGoogleAuthLogin from "./useGoogleAuthLogin";
import useLogin from "./useLogin";

type LoginFormValues = z.infer<typeof loginSchema>;

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Show a success message if user just registered
  useEffect(() => {
    const registered = searchParams.get("registered");
    if (registered === "true") {
      toast.success("Account created successfully", {
        description: "You have been registered successfully. Please log in.",
      });

      // Remove query param to prevent re-triggering the message
      const newUrl = new URL(window.location.href);
      newUrl.searchParams.delete("registered");
      router.replace(newUrl.toString(), undefined);
    }
  }, [searchParams, router]);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // Login Mutation
  const loginMutation = useLogin();

  // Google Sign-In Mutation
  const googleSignInMutation = useGoogleAuthLogin();

  return (
    <div className="space-y-10">
      {/* Google Login */}
      <div className="grid gap-2">
        <Button
          variant="outline"
          disabled={googleSignInMutation.isPending}
          onClick={() => googleSignInMutation.mutate()}
        >
          {googleSignInMutation.isPending ? (
            <Loader2 className="mr-2 size-4 animate-spin" />
          ) : (
            <>
              <GoogleLoginIcon />
              <p className="ml-2 font-semibold">Continue with Google</p>
            </>
          )}
        </Button>
      </div>

      {/* Divider */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            Or continue with
          </span>
        </div>
      </div>

      {/* Email/Password Login Form */}
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit((data) => loginMutation.mutate(data))}
          className="space-y-8"
        >
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    placeholder="example@example.com"
                    type="email"
                    autoComplete="email"
                    disabled={loginMutation.isPending}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input
                    placeholder="********"
                    type="password"
                    autoComplete="current-password"
                    disabled={loginMutation.isPending}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Error Message */}
          {loginMutation.isError && (
            <div className="text-sm text-destructive font-medium">
              {loginMutation.error instanceof Error
                ? loginMutation.error.message
                : "Something went wrong"}
            </div>
          )}

          {/* Login Button */}
          <Button
            type="submit"
            className="w-full"
            disabled={loginMutation.isPending}
          >
            {loginMutation.isPending && (
              <Loader2 className="mr-2 size-4 animate-spin" />
            )}
            Log in
          </Button>
        </form>
      </Form>
    </div>
  );
}
