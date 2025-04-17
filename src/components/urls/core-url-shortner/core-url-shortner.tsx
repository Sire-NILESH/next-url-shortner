"use client";

import { Separator } from "@/components/ui/separator";
import { UrlFormData, urlSchema } from "@/lib/URLSchema";
import { cn } from "@/lib/utils";
import { shrinkifyUrl } from "@/server/actions/urls/shrinkify-url";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import { ComponentProps, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { DashboardSuggestionDialog } from "../../dialogs/dashboard-suggestion-dialog";
import { Button } from "../../ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "../../ui/form";
import { Input } from "../../ui/input";
import ShortenedURLResultCard from "./shortened-url-result-card";
import { BASE_URL } from "@/site-config/base-url";

type Props = ComponentProps<"div">;

export function CoreUrlShortner({ className, ...props }: Props) {
  const [showDashboardSuggestion, setShowDashboardSuggestion] = useState(false);
  const { data: session } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  const form = useForm<UrlFormData>({
    resolver: zodResolver(urlSchema),
    defaultValues: {
      url: "",
      customCode: "",
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: UrlFormData) => {
      const formData = new FormData();
      formData.append("url", data.url);

      if (data.customCode?.trim()) {
        formData.append("customCode", data.customCode.trim());
      }

      const response = await shrinkifyUrl(formData);

      if (!response.success) {
        // 🔁 Perform redirect on client side if redicrect url is present
        if (response.redirect) {
          window.location.href = response.redirect;
        }

        throw new Error(response.error);
      }

      return response;
    },
    onSuccess: (response) => {
      if (response.success && response.data) {
        toast.success("URL shrinkified successfully");

        if (response.data.flagged) {
          toast.warning(response.data.message || "This URL is flagged", {
            description: response.data.flagReason,
          });
        }

        if (session?.user && pathname.includes("/dashboard")) {
          router.refresh();
        }
      }
    },
    onError: (error) => {
      const message = error.message
        ? error.message
        : "An error occurred. Please try again.";
      toast.error(message);
    },
  });

  useEffect(() => {
    const hasSeenDashboardSuggestion = sessionStorage.getItem(
      "hasSeenDashboardSuggestion"
    );

    if (
      !hasSeenDashboardSuggestion &&
      pathname === "/" &&
      session?.user &&
      mutation.data?.success &&
      !mutation.data.data.threat
    ) {
      setShowDashboardSuggestion(true);
      sessionStorage.setItem("hasSeenDashboardSuggestion", "true");
    }
  }, [
    mutation?.data?.data.threat,
    mutation.data?.success,
    pathname,
    session?.user,
  ]);

  const onSubmit = (data: UrlFormData) => mutation.mutate(data);

  return (
    <>
      <div
        className={cn("w-full max-w-2xl mx-auto @container", className)}
        {...props}
      >
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6 sm:space-y-8 w-full max-w-2xl mx-auto"
          >
            <div className="flex flex-col sm:flex-row sm:items-start gap-6 sm:gap-2">
              <FormField
                control={form.control}
                name="url"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormControl>
                      <Input
                        className="h-12 bg-secondary rounded-full"
                        placeholder="Paste your long URL here"
                        {...field}
                        disabled={mutation.isPending}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                className="h-12 rounded-full"
                disabled={mutation.isPending}
              >
                {mutation.isPending ? (
                  <>
                    <span className="mr-2 size-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    Shrinkifying...
                  </>
                ) : (
                  "Shrinkify"
                )}
              </Button>
            </div>

            <div className="flex items-center mx-16">
              <Separator className="flex-1" />
              <p className="flex-1 text-center text-sm text-muted-foreground">
                Or <span className="hidden @md:inline">provide your own</span>
              </p>
              <Separator className="flex-1" />
            </div>

            <FormField
              control={form.control}
              name="customCode"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div className="flex items-center w-full @sm:w-fit @sm:max-w-lg mx-auto">
                      <span className="text-sm text-muted-foreground mr-2">
                        {BASE_URL}
                        /r/
                      </span>
                      <Input
                        placeholder="Custom code (optional)"
                        {...field}
                        value={field.value || ""}
                        onChange={(e) => field.onChange(e.target.value || "")}
                        disabled={mutation.isPending}
                        className="flex-1"
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
        {mutation.data?.data?.shortUrl && (
          <ShortenedURLResultCard
            className="mt-10 md:mt-16"
            threat={mutation.data.data.threat}
            shortUrl={mutation.data.data.shortUrl}
            shortCode={mutation.data.data.shortUrl.split("/r/")[1]}
            flaggedInfo={
              mutation.data.data.flagged
                ? {
                    flagged: mutation.data.data.flagged,
                    reason: mutation.data.data.flagReason || null,
                    message: mutation.data.data.message,
                  }
                : null
            }
          />
        )}
      </div>
      <DashboardSuggestionDialog
        isOpen={showDashboardSuggestion}
        onOpenChange={() => setShowDashboardSuggestion((prev) => !prev)}
        shortUrl={mutation.data?.data?.shortUrl || ""}
      />
    </>
  );
}
