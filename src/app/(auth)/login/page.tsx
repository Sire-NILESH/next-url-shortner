import { LoginForm } from "@/components/auth/login-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";

export default function LoginPage() {
  return (
    <div className="flex flex-col items-center justify-center">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 max-w-lg">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">
            Welcome back!
          </h1>
          <p className="text-sm text-muted-foreground">
            Enter your credentials below to log in to your account.
          </p>
        </div>

        <Card>
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
