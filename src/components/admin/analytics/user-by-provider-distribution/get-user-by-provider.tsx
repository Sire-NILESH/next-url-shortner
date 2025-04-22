import { fetchUserByProviderChartData } from "@/lib/api/fetch-user-by-provider-chart-data";
import { TimeRange } from "@/lib/timeRanges";
import { cn } from "@/lib/utils";
import { useSuspenseQuery } from "@tanstack/react-query";
import { ComponentProps } from "react";
import UserByProviderDistributionContent from "./user-by-provider-distribution-content";
import { ApiResponse } from "@/types/server/types";
import { UsersByProviderResType } from "@/types/client/types";

type Props = ComponentProps<"div"> & {
  timeRange: TimeRange;
};

type ResponseType = ApiResponse<UsersByProviderResType>;

const GetUserByProvider = ({ className, timeRange, ...props }: Props) => {
  const { data } = useSuspenseQuery<ResponseType>({
    queryKey: ["user-by-provider-distribution", timeRange],
    queryFn: () =>
      fetchUserByProviderChartData({
        timeRange: timeRange,
      }),
    staleTime: 1000 * 60,
  });

  // if (isPending) {
  //   return <UserByProviderSkeleton />;
  // }

  return (
    <UserByProviderDistributionContent
      chartData={data.success ? data.data : []}
      className={cn("", className)}
      {...props}
    />
  );
};

export default GetUserByProvider;
