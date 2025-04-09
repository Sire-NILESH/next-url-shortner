import { CardTitle } from "@/components/ui/card";
import { formatNumber } from "@/lib/helpers";
import timeRanges from "@/lib/timeRanges";
import { cn } from "@/lib/utils";
import { getTotalFlaggedUrlStat } from "@/server/actions/admin/urls/get-total-flagged-urls-stat";
import { ComponentProps } from "react";

type Props = ComponentProps<"div"> & {
  timeRange?: keyof typeof timeRanges;
};

export default async function TotalFlaggedUrlStatStreamed({
  className,
  timeRange,
  ...props
}: Props) {
  const response = await getTotalFlaggedUrlStat({ timeRange });

  return (
    <CardTitle
      className={cn(
        "@[250px]/card:text-3xl text-2xl font-semibold tabular-nums",
        className
      )}
      {...props}
    >
      {response.success
        ? formatNumber(response.data?.totalFlaggedUrls)
        : "Error"}
    </CardTitle>
  );
}
