import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteUrl } from "@/server/actions/urls/delete-url";
import { toast } from "sonner";
import { UserUrl } from "@/types/client/types";

export function useDeleteUserUrl() {
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: (id: number) => deleteUrl({ urlId: id }),
    onSuccess: (response, id) => {
      if (response.success) {
        queryClient.setQueryData(
          ["my-urls"],
          (oldData: UserUrl[] | undefined) =>
            oldData ? oldData.filter((url) => url.id !== id) : []
        );
        toast.success("URL deleted successfully", {
          description: "The URL has been deleted successfully",
        });
      } else {
        toast.error("Failed to delete URL", {
          description: response.error || "An error occurred",
        });
      }
    },
    onError: (error) => {
      console.error("Failed to delete URL", error);
      toast.error("Failed to delete URL", {
        description: "An error occurred",
      });
    },
  });

  return {
    deleteMutation,
  };
}
