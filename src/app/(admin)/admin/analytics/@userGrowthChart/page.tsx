import { UserGrowthLineAreaChart } from "@/components/admin/analytics/user-growth-chart/user-growth-chart";
import { getUsersOverTime } from "@/server/actions/admin/users/get-users-over-time";
import { QueryClient } from "@tanstack/react-query";

export default async function UserGrowthChartSlot() {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["user-growth", "6M"],
    queryFn: () => getUsersOverTime({ timeRange: "6M" }),
  });

  return <UserGrowthLineAreaChart />;
}
