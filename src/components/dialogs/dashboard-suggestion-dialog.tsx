"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Button, buttonVariants } from "../ui/button";
import { Check, Copy, LayoutDashboard, Megaphone } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

interface DashboardSuggestionDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  shortUrl: string;
}

export function DashboardSuggestionDialog({
  isOpen,
  onOpenChange,
  shortUrl,
}: DashboardSuggestionDialogProps) {
  const copyToClipboard = async () => {
    if (!shortUrl) return;

    try {
      await navigator.clipboard.writeText(shortUrl);
      toast.success("URL copied to clipboard");
    } catch (error) {
      console.error(error);
    }
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
                Visit your dashboard to:
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
                View all your shrinkified links
              </li>
              <li className="flex gap-2">
                <Check
                  size={16}
                  strokeWidth={2}
                  className="mt-0.5 shrink-0 text-primary"
                  aria-hidden="true"
                />
                Visualise performance with analytics
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
          <Button
            type="button"
            variant={"outline"}
            className="flex-shrink-0"
            onClick={copyToClipboard}
          >
            <Copy className="size-4 mr-1" />
            Copy
          </Button>
          <Link
            href="/dashboard"
            className={buttonVariants({ variant: "default" })}
          >
            <LayoutDashboard className="size-4" />
            My Dashboard
          </Link>
          <Button variant="secondary" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
