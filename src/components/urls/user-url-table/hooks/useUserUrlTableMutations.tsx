import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteUrl } from "@/server/actions/urls/delete-url";
import { toast } from "sonner";
import { UserUrl } from "@/types/client/types";

export function useUserUrlTableMutations() {
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

  const handleEditSuccess = (
    urlToEdit: { id: number; shortCode: string; name: string | null } | null,
    newShortCode: string,
    name?: string
  ) => {
    if (!urlToEdit) return;

    queryClient.setQueryData(["my-urls"], (oldData: UserUrl[] | undefined) =>
      oldData
        ? oldData.map((url) =>
            url.id === urlToEdit.id
              ? { ...url, shortCode: newShortCode, name: name || url.name }
              : url
          )
        : []
    );
  };

  return {
    deleteMutation,
    handleEditSuccess,
  };
}
