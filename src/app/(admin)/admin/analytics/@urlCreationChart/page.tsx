import UrlVsFlaggedChart from "@/components/admin/analytics/url-vs-flagged-chart/url-vs-flagged-chart";
import { getUrlVsFlaggedUrlByTime } from "@/server/actions/admin/urls/get-url-vs-flagged-url-by-time";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";

export default async function UrlCreationChartSlot() {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["url-vs-flagged-chart-data", "6M"],
    queryFn: () => getUrlVsFlaggedUrlByTime({ timeRange: "6M" }),
  });
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <UrlVsFlaggedChart />
    </HydrationBoundary>
  );
}
