import { toast } from "sonner";
import { BASE_URL } from "@/site-config/base-url";
import { UserUrl } from "@/types/client/types";
import { ApiResponse } from "@/types/server/types";

type UserUrlResType = ApiResponse<UserUrl[]>;

export const fetchMyUrls = async () => {
  const response = await fetch(`${BASE_URL}/api/v1/urls/my-urls`);
  const data: UserUrlResType = await response.json();

  if (!data.success) {
    toast.error("Failed fetch user urls.", {
      description: data.error,
    });

    return [];
  }

  return data.data ? data.data : [];
};
