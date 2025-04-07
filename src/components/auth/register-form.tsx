"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeClosed, Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
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
import { registerSchema } from "./schema";
import useRegister from "./useRegister";
import { useState } from "react";

type RegisterFormValues = z.infer<typeof registerSchema>;

export function RegisterForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);

  const registerMutation = useRegister();

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit((data) => registerMutation.mutate(data))}
        className="space-y-8"
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input
                  placeholder="John Doe"
                  autoComplete="name"
                  disabled={registerMutation.isPending}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
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
                  disabled={registerMutation.isPending}
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
                <div className="relative">
                  <Input
                    id="register__password"
                    placeholder="********"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    disabled={registerMutation.isPending}
                    {...field}
                  />
                  <Button
                    type="button"
                    variant={"ghost"}
                    size={"sm"}
                    title={showPassword ? "Hide Password" : "Show Password"}
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                    aria-controls="register__password"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className={"absolute right-2 top-1/2 -translate-y-1/2"}
                  >
                    {showPassword ? <EyeClosed /> : <Eye />}
                  </Button>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirm Password</FormLabel>
              <FormControl>
                <div className="relative">
                  <Input
                    id="register__confirmPassword"
                    placeholder="********"
                    type={showPasswordConfirm ? "text" : "password"}
                    autoComplete="new-password"
                    disabled={registerMutation.isPending}
                    {...field}
                  />
                  <Button
                    type="button"
                    variant={"ghost"}
                    size={"sm"}
                    title={
                      showPasswordConfirm ? "Hide Password" : "Show Password"
                    }
                    aria-label={
                      showPasswordConfirm ? "Hide password" : "Show password"
                    }
                    aria-controls="register__passwordConfirm"
                    onClick={() => setShowPasswordConfirm((prev) => !prev)}
                    className={"absolute right-2 top-1/2 -translate-y-1/2"}
                  >
                    {showPasswordConfirm ? <EyeClosed /> : <Eye />}
                  </Button>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          className="w-full"
          disabled={registerMutation.isPending}
        >
          {registerMutation.isPending && (
            <Loader2 className="mr-2 size-4 animate-spin" />
          )}
          Create Account
        </Button>
      </form>
    </Form>
  );
}
