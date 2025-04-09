import { CardTitle } from "@/components/ui/card";
import { formatNumber } from "@/lib/helpers";
import timeRanges from "@/lib/timeRanges";
import { cn } from "@/lib/utils";
import { getTotalUsersStat } from "@/server/actions/admin/users/get-total-users-stat";
import { ComponentProps } from "react";

type Props = ComponentProps<"div"> & {
  timeRange?: keyof typeof timeRanges;
};

export default async function TotalUsersStatStreamed({
  className,
  timeRange,
  ...props
}: Props) {
  const response = await getTotalUsersStat({ timeRange });
  return (
    <CardTitle
      className={cn(
        "@[250px]/card:text-3xl text-2xl font-semibold tabular-nums",
        className
      )}
      {...props}
    >
      {response.success ? formatNumber(response.data?.totalUsers) : "Error"}
    </CardTitle>
  );
}
