import { fetchMyUrls } from "@/lib/api/fetch-my-urls";
import { UserUrl } from "@/types/client/types";
import { useQuery } from "@tanstack/react-query";

export default function useMyUrls({ initialData }: { initialData: UserUrl[] }) {
  return useQuery({
    queryKey: ["my-urls"],
    queryFn: fetchMyUrls,
    initialData: initialData,
    staleTime: 1000 * 60,
  });
}
