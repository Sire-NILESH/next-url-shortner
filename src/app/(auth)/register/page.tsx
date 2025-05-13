import { RegisterForm } from "@/components/auth/register-form";
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
  title: "Register | Shrinkify",
  description: "Dashboard page",
};

export default function RegisterPage() {
  return (
    <div className="my-6 md:my-20 flex flex-1 flex-col">
      <div className="my-32 mx-auto flex w-full flex-col justify-center space-y-6 max-w-lg">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-4xl boldText">Create an account</h1>
          <p className="text-sm md:text-lg text-muted-foreground leading-relaxed tracking-tight">
            Enter your details and create a free account to get started.
          </p>
        </div>

        <Card className="py-10">
          <CardHeader className="mb-2">
            <CardTitle className="text-xl text-card-foreground/80">
              Register
            </CardTitle>
            <CardDescription>
              Fill your details below to create an account.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <RegisterForm />
          </CardContent>
        </Card>

        <p className="text-center text-sm md:text-base">
          Already have an account?{" "}
          <Link href={"/login"} className="underline">
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
}
