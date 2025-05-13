import UserByProviderDistribution from "@/components/admin/analytics/user-by-provider-distribution/user-by-provider-distribution";
import { getUsersByProviderChartData } from "@/server/services/admin/user/get-user-by-provider-chart-data.service";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";

export default async function UserByProviderChartSlot() {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["user-by-provider-distribution", "6M"],
    queryFn: () => getUsersByProviderChartData({ timeRange: "6M" }),
    staleTime: 1000 * 60,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <UserByProviderDistribution />
    </HydrationBoundary>
  );
}
