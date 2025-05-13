import ClicksInfoChart from "@/components/admin/analytics/clicks-info-chart/clicks-info-chart";
import { getClicksVsFlaggedChartData } from "@/server/services/admin/clicks/get-clicks-vs-flagged-chart-data.service";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";

export default async function ClicksStackedBarChartSlot() {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["admin-clicks-info-chart", "6M"],
    queryFn: () => getClicksVsFlaggedChartData({ timeRange: "6M" }),
    staleTime: 1000 * 60,
  });
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ClicksInfoChart />
    </HydrationBoundary>
  );
}
