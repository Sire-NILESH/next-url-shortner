import {
  UpdateShrinkifyUrlFormData,
  updateShrinkifyUrlFormSchema,
} from "@/lib/validations/URLSchema";
import { updateUrl } from "@/server/actions/urls/update-url";
import { BASE_URL } from "@/site-config/base-url";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { UserUrl } from "@/types/client/types";

interface EditUrlModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  urlId: number;
  urlName: string | null;
  currentShortCode: string;
}

export function EditUrlModal({
  isOpen,
  onOpenChange,
  urlId,
  urlName,
  currentShortCode,
}: EditUrlModalProps) {
  const queryClient = useQueryClient();

  const form = useForm<UpdateShrinkifyUrlFormData>({
    resolver: zodResolver(updateShrinkifyUrlFormSchema),
    defaultValues: {
      customCode: currentShortCode,
      name: urlName ? urlName : undefined, // Optional: set to actual name if available
    },
  });

  useEffect(() => {
    form.reset({
      customCode: currentShortCode,
      name: urlName ? urlName : undefined, // Optional: reset to actual name if available
    });
  }, [currentShortCode, form, urlName]);

  const mutation = useMutation({
    mutationFn: async (data: UpdateShrinkifyUrlFormData) => {
      const formData = new FormData();
      formData.append("id", urlId.toString());
      formData.append("customCode", data.customCode);
      if (data.name) formData.append("name", data.name);
      return updateUrl(formData);
    },
    onSuccess: (response, variables) => {
      if (response.success && response.data) {
        toast.success("URL updated successfully", {
          description: "The URL has been updated successfully",
        });

        queryClient.setQueryData(
          ["my-urls"],
          (oldData: UserUrl[] | undefined) =>
            oldData
              ? oldData.map((url) =>
                  url.id === urlId
                    ? {
                        ...url,
                        shortCode: variables.customCode,
                        name: variables.name || url.name,
                      }
                    : url
                )
              : []
        );
        onOpenChange(false);
      } else {
        toast.error("Failed to update URL", {
          description:
            !response.success && response.error
              ? response.error
              : "An error occurred",
        });
      }
    },
    onError: () => {
      toast.error("Failed to update URL", {
        description: "An error occurred",
      });
    },
  });

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl space-y-8 sm:space-y-0">
        <DialogHeader>
          <DialogTitle>
            Edit <span className="brandText">Shrinkify</span> URL
          </DialogTitle>
          <DialogDescription>
            Customize the short code for this URL. The short code must be unique
            and can only contain letters, numbers, hyphens, and underscores.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit((data) => mutation.mutate(data))}
            className="space-y-12 sm:space-y-4"
          >
            <FormField
              control={form.control}
              name="customCode"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div className="flex flex-col sm:flex-row items-center gap-3">
                      <span className="sm:text-sm text-muted-foreground sm:mr-2">
                        {BASE_URL}/r/
                      </span>
                      <Input
                        placeholder="Custom code"
                        {...field}
                        disabled={mutation.isPending}
                        className="flex-1 p-2"
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      placeholder="Name (optional)"
                      {...field}
                      disabled={mutation.isPending}
                      className="p-2"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="sm:justify-end">
              <Button
                type="button"
                variant={"outline"}
                onClick={() => onOpenChange(false)}
                disabled={mutation.isPending}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={mutation.isPending}>
                {mutation.isPending ? (
                  <>
                    <Loader2 className="animate-spin size-4 mr-2" />
                    Updating...
                  </>
                ) : (
                  "Save Changes"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
