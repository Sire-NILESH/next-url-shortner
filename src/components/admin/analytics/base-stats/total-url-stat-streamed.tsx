import { CardTitle } from "@/components/ui/card";
import { formatNumber } from "@/lib/formatNum";
import timeRanges from "@/lib/timeRanges";
import { cn } from "@/lib/utils";
import { getTotalUrlStat } from "@/server/actions/admin/urls/get-total-urls-stat";
import { ComponentProps } from "react";

type Props = ComponentProps<"div"> & {
  timeRange?: keyof typeof timeRanges;
};

export default async function TotalUrlStatStreamed({
  className,
  timeRange,
  ...props
}: Props) {
  const response = await getTotalUrlStat({ timeRange });

  return (
    <CardTitle
      className={cn(
        "@[250px]/card:text-3xl text-2xl font-semibold tabular-nums",
        className
      )}
      {...props}
    >
      {response.success ? formatNumber(response.data?.totalUrls) : "Error"}
    </CardTitle>
  );
}
