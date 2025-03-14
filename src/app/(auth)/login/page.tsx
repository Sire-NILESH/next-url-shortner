import { LoginForm } from "@/components/auth/login-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Login | Shrinkify",
  description: "Dashboard page",
};

export default function LoginPage() {
  return (
    <div className="my-6 md:my-20 flex flex-1 flex-col">
      <div className="my-32 mx-auto flex w-full flex-col justify-center space-y-6 max-w-lg">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-4xl boldText">Welcome back!</h1>
          <p className="text-lg text-muted-foreground leading-relaxed tracking-tight">
            Login to your account to unlock full potential.
          </p>
        </div>

        <Card className="py-10">
          <CardHeader className="space-y-1">
            <CardTitle>Log in</CardTitle>
            <CardDescription>
              Choose a log-in method below to continue.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <LoginForm />
          </CardContent>
        </Card>

        <p className="text-center">
          New here?{" "}
          <Link href={"/register"} className="underline">
            Create a free account
          </Link>
        </p>
      </div>
    </div>
  );
}
