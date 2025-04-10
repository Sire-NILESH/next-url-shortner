import { TimeRange } from "@/lib/timeRanges";
import { getUrlVsFlaggedUrlByTime } from "@/server/actions/admin/urls/get-url-vs-flagged-url-by-time";
import { useSuspenseQuery } from "@tanstack/react-query";
import { ComponentProps } from "react";
import UrlVsFlaggedContent from "./url-vs-flagged-content";
import { cn } from "@/lib/utils";

type Props = ComponentProps<"div"> & {
  timeRange: TimeRange;
};

const GetUrlVsFlagged = ({ className, timeRange, ...props }: Props) => {
  const { data } = useSuspenseQuery({
    queryKey: ["url-vs-flagged-chart-data", timeRange],
    queryFn: () =>
      getUrlVsFlaggedUrlByTime({
        timeRange: timeRange,
      }),
  });

  // if (isPending) {
  //   return <UserGrowthSkeleton />;
  // }

  return (
    <UrlVsFlaggedContent
      chartData={data?.data ?? []}
      className={cn("", className)}
      {...props}
    />
  );
};

export default GetUrlVsFlagged;
