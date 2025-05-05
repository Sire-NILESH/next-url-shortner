import { fetchMyUrls } from "@/lib/api/fetch-my-urls";
import { useQuery } from "@tanstack/react-query";

export default function useMyUrls() {
  return useQuery({
    queryKey: ["my-urls"],
    queryFn: fetchMyUrls,
    staleTime: 1000 * 60,
  });
}
