import { UserGrowthLineAreaChart } from "@/components/admin/analytics/user-growth-chart/user-growth-chart";
import { getUserGrowthChartData } from "@/server/services/admin/user/get-user-growth-chart-data.service";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";

export default async function UserGrowthChartSlot() {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["user-growth", "6M"],
    queryFn: () => getUserGrowthChartData({ timeRange: "6M" }),
    staleTime: 1000 * 60,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <UserGrowthLineAreaChart />
    </HydrationBoundary>
  );
}
