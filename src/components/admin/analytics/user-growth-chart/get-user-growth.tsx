import { TimeRange } from "@/lib/timeRanges";
import { cn } from "@/lib/utils";
import { getUsersOverTime } from "@/server/actions/admin/users/get-users-over-time";
import { useSuspenseQuery } from "@tanstack/react-query";
import { ComponentProps } from "react";
import UserGrowthChartContent from "./user-growth-chart-content";

type Props = ComponentProps<"div"> & {
  timeRange: TimeRange;
};

const GetUserGrowth = ({ className, timeRange, ...props }: Props) => {
  const { data } = useSuspenseQuery({
    queryKey: ["user-growth", timeRange],
    queryFn: () =>
      getUsersOverTime({
        timeRange: timeRange,
      }),
  });

  // if (isPending) {
  //   return <UserGrowthSkeleton />;
  // }

  return (
    <UserGrowthChartContent
      chartData={data?.data ?? []}
      className={cn("", className)}
      {...props}
    />
  );
};

export default GetUserGrowth;
