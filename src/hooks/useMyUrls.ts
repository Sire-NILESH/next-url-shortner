import { fetchMyUrls } from "@/lib/api/fetch-my-urls";
import { useSuspenseQuery } from "@tanstack/react-query";

export default function useMyUrls() {
  return useSuspenseQuery({
    queryKey: ["my-urls"],
    queryFn: fetchMyUrls,
    staleTime: 1000 * 60,
  });
}
