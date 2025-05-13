import { TimeRange } from "@/lib/timeRanges";
import { cn } from "@/lib/utils";
import { useSuspenseQuery } from "@tanstack/react-query";
import { ComponentProps } from "react";
import UserGrowthChartContent from "./user-growth-chart-content";
import { fetchUserGrowthChartData } from "@/lib/api/fetch-user-growth-chart-data";
import { ApiResponse } from "@/types/server/types";
import { UserGrowthResType } from "@/types/client/types";

type Props = ComponentProps<"div"> & {
  timeRange: TimeRange;
};

type ResponseType = ApiResponse<UserGrowthResType>;

const GetUserGrowth = ({ className, timeRange, ...props }: Props) => {
  const { data } = useSuspenseQuery<ResponseType>({
    queryKey: ["user-growth", timeRange],
    queryFn: () =>
      fetchUserGrowthChartData({
        timeRange: timeRange,
      }),
    staleTime: 1000 * 60,
  });

  // if (isPending) {
  //   return <UserGrowthSkeleton />;
  // }

  return (
    <UserGrowthChartContent
      chartData={data.success ? data.data : []}
      className={cn("", className)}
      {...props}
    />
  );
};

export default GetUserGrowth;
