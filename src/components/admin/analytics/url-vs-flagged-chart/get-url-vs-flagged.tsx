import { TimeRange } from "@/lib/timeRanges";
import { useSuspenseQuery } from "@tanstack/react-query";
import { ComponentProps } from "react";
import UrlVsFlaggedContent from "./url-vs-flagged-content";
import { cn } from "@/lib/utils";
import { fetchUrlVsFlaggedChartData } from "@/lib/api/fetch-url-vs-flagged-chart-data";
import { UrlVsFlaggedRouteResType } from "@/types/client/types";
import { ApiResponse } from "@/types/server/types";
// import UrlVsFlaggedSkeleton from "./url-vs-flagged-skeleton";

type Props = ComponentProps<"div"> & {
  timeRange: TimeRange;
};

type ResponseType = ApiResponse<UrlVsFlaggedRouteResType>;

const GetUrlVsFlagged = ({ className, timeRange, ...props }: Props) => {
  const { data } = useSuspenseQuery<ResponseType>({
    queryKey: ["url-vs-flagged-chart-data", timeRange],
    queryFn: () =>
      fetchUrlVsFlaggedChartData({
        timeRange: timeRange,
      }),
    staleTime: 1000 * 60,
  });

  // if (isLoading) {
  //   return <UrlVsFlaggedSkeleton />;
  // }

  return (
    <UrlVsFlaggedContent
      chartData={data.success ? data.data : []}
      className={cn("", className)}
      {...props}
    />
  );
};

export default GetUrlVsFlagged;
