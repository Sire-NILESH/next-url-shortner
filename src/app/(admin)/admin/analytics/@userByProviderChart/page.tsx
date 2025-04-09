import UserByProviderDistribution from "@/components/admin/analytics/user-by-provider-distribution/user-by-provider-distribution";
import { getUsersByProviderOverTime } from "@/server/actions/admin/users/get-users-by-provider-over-time";
import { QueryClient } from "@tanstack/react-query";

export default async function UserByProviderChartSlot() {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["user-by-provider-distribution", "6M"],
    queryFn: () => getUsersByProviderOverTime({ timeRange: "6M" }),
  });

  return <UserByProviderDistribution />;
}
