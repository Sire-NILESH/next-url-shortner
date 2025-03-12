"use client";

import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Check, Megaphone } from "lucide-react";

interface SignupSuggestionDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  shortUrl: string;
}

export function SignupSuggestionDialog({
  isOpen,
  onOpenChange,
  shortUrl,
}: SignupSuggestionDialogProps) {
  const router = useRouter();

  const handleSignup = () => {
    onOpenChange(false);
    router.push("/register");
  };

  const handleSignin = () => {
    onOpenChange(false);
    router.push("/login");
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="py-10 sm:max-w-md space-y-3">
        <DialogHeader>
          <div className="flex flex-col gap-3">
            <div
              className="flex size-11 shrink-0 items-center justify-center rounded-full border border-border bg-yellow-200/10"
              aria-hidden="true"
            >
              <Megaphone
                className="opacity-80 text-yellow-700"
                size={16}
                strokeWidth={2}
              />
            </div>
            <DialogTitle>
              URL <span className="brandText">Shrinkified</span> Successfully
            </DialogTitle>
            <DialogDescription>
              {
                "Your link has been Shrinkified and is ready to use but don't you also want to save and track this link?"
              }
            </DialogDescription>
          </div>
        </DialogHeader>

        <div className="flex flex-col space-y-6">
          <div className="rounded-md bg-muted p-4">
            <p className="text-sm font-medium">Your shortened URL</p>
            <p className="mt-1 break-all font-mono text-sm">{shortUrl}</p>
          </div>

          <div className="space-y-3">
            <p>
              <strong className="text-sm font-medium">
                Create an account to:
              </strong>
            </p>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex gap-2">
                <Check
                  size={16}
                  strokeWidth={2}
                  className="mt-0.5 shrink-0 text-primary"
                  aria-hidden="true"
                />
                Save all your shrinkified links
              </li>
              <li className="flex gap-2">
                <Check
                  size={16}
                  strokeWidth={2}
                  className="mt-0.5 shrink-0 text-primary"
                  aria-hidden="true"
                />
                Track links with analytics
              </li>
              <li className="flex gap-2">
                <Check
                  size={16}
                  strokeWidth={2}
                  className="mt-0.5 shrink-0 text-primary"
                  aria-hidden="true"
                />
                Customize your shrinkified links
              </li>
            </ul>
          </div>
        </div>
        <DialogFooter className="flex flex-col gap-2 sm:flex-col">
          <Button variant={"outline"} onClick={handleSignin}>
            Log In
          </Button>
          <Button onClick={handleSignup}>Sign Up</Button>
          <Button variant={"secondary"} onClick={() => onOpenChange(false)}>
            Maybe Later
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
