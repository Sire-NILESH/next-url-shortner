import { fetchClicksInfoChartData } from "@/lib/api/fetch-clicks-info-chart-data";
import { TimeRange } from "@/lib/timeRanges";
import { cn } from "@/lib/utils";
import { ClicksInfoChartResType } from "@/types/client/types";
import { ApiResponse } from "@/types/server/types";
import { useSuspenseQuery } from "@tanstack/react-query";
import { ComponentProps } from "react";
import ClicksInfoChartContent from "./clicks-info-chart-content";

type Props = ComponentProps<"div"> & {
  timeRange: TimeRange;
};

type ResponseType = ApiResponse<ClicksInfoChartResType>;

const GetClicksInfo = ({ className, timeRange, ...props }: Props) => {
  const { data } = useSuspenseQuery<ResponseType>({
    queryKey: ["admin-clicks-info-chart", timeRange],
    queryFn: () =>
      fetchClicksInfoChartData({
        timeRange: timeRange,
      }),
    staleTime: 1000 * 60,
  });

  // if (isLoading) {
  //   return <UrlVsFlaggedSkeleton />;
  // }

  return (
    <ClicksInfoChartContent
      chartData={data.success ? data.data : []}
      className={cn("", className)}
      {...props}
    />
  );
};

export default GetClicksInfo;
