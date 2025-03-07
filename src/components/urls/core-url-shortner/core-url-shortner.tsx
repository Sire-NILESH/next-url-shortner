"use client";

import { UrlFormData, urlSchema } from "@/lib/URLSchema";
import { shortenUrl } from "@/server/actions/urls/shorten-url";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSession } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { SignupSuggestionDialog } from "../../dialogs/signup-suggestion-dialog";
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

export function CoreUrlShortner() {
  const { data: session } = useSession();

  const router = useRouter();
  const pathname = usePathname();

  const [shortUrl, setShortUrl] = useState<string | null>(null);
  const [shortCode, setShortCode] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showSignupDialog, setShowSignupDialog] = useState(false);
  const [flaggedInfo, setFlaggedInfo] = useState<{
    flagged: boolean;
    reason: string | null;
    message: string | undefined;
  } | null>(null);

  const form = useForm<UrlFormData>({
    resolver: zodResolver(urlSchema),
    defaultValues: {
      url: "",
      customCode: "",
    },
  });

  const onSubmit = async (data: UrlFormData) => {
    setIsLoading(true);
    setError(null);
    setShortUrl(null);
    setShortCode(null);
    setFlaggedInfo(null);

    try {
      const formData = new FormData();
      formData.append("url", data.url);

      // If a custom code is provided, append it to the form data
      if (data.customCode && data.customCode.trim() !== "") {
        formData.append("customCode", data.customCode.trim());
      }

      const response = await shortenUrl(formData);

      console.log({ response });

      if (response.success && response.data) {
        setShortUrl(response.data.shortUrl);
        // Extract the short code from the short URL
        const shortCodeMatch = response.data.shortUrl.match(/\/r\/([^/]+)$/);
        if (shortCodeMatch && shortCodeMatch[1]) {
          setShortCode(shortCodeMatch[1]);
        }

        if (response.data.flagged) {
          setFlaggedInfo({
            flagged: response.data.flagged,
            reason: response.data.flagReason || null,
            message: response.data.message,
          });

          toast.warning(response.data.message || "This URL is flagged", {
            description: response.data.flagReason,
          });
        } else {
          toast.success("URL shortened successfully");
        }
      }

      if (session?.user && pathname.includes("/dashboard")) {
        router.refresh();
      }

      if (!session?.user) {
        setShowSignupDialog(true);
      }
    } catch (error) {
      setError("An error occurred. Please try again.");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="w-full max-w-2xl mx-auto">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 sm:space-y-8"
          >
            <div className="flex flex-col sm:flex-row sm:items-center gap-2">
              <FormField
                control={form.control}
                name="url"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormControl>
                      <Input
                        className="h-12 bg-secondary  rounded-full"
                        placeholder="Paste your long URL here"
                        {...field}
                        disabled={false}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className="h-12 rounded-full"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <span className="mr-2 size-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    Shortening...
                  </>
                ) : (
                  "Shorten"
                )}
              </Button>
            </div>

            <FormField
              control={form.control}
              name="customCode"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div className="flex items-center">
                      <span className="text-sm text-muted-foreground mr-2">
                        {process.env.NEXT_PUBLIC_APP_URL ||
                          window.location.origin}
                        /r/
                      </span>
                      <Input
                        placeholder="Custom code (optional)"
                        {...field}
                        value={field.value || ""}
                        onChange={(e) => field.onChange(e.target.value || "")}
                        disabled={isLoading}
                        className="flex-1"
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {error && (
              <div className="p-3 bg-destructive/10 text-destructive rounded-md text-sm">
                {error}
              </div>
            )}
          </form>
        </Form>

        {shortUrl && (
          <ShortenedURLResultCard
            className="mt-10 md:mt-16"
            shortUrl={shortUrl}
            shortCode={shortCode}
            flaggedInfo={flaggedInfo}
          />
        )}
      </div>

      <SignupSuggestionDialog
        isOpen={showSignupDialog}
        onOpenChange={setShowSignupDialog}
        shortUrl={shortUrl || ""}
      />
    </>
  );
}

// function MagicButton({
//   className,
//   children,
//   ...props
// }: ComponentProps<"button">) {
//   return (
//     <button
//       className={cn(
//         "relative inline-flex h-12 overflow-hidden rounded-full p-[1px] focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50",
//         className
//       )}
//       {...props}
//     >
//       <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]" />
//       <span className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-slate-950 px-3 py-1 text-sm font-medium text-white backdrop-blur-3xl">
//         {children}
//       </span>
//     </button>
//   );
// }
