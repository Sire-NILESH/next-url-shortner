import UrlVsFlaggedChart from "@/components/admin/analytics/url-vs-flagged-chart/url-vs-flagged-chart";
import { getUrlVsFlaggedChartData } from "@/server/services/admin/url/get-url-vs-flagged-chart-data.service";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";

export default async function UrlCreationChartSlot() {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["url-vs-flagged-chart-data", "6M"],
    queryFn: () => getUrlVsFlaggedChartData({ timeRange: "6M" }),
    staleTime: 1000 * 60,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <UrlVsFlaggedChart />
    </HydrationBoundary>
  );
}
