import { TimeRange } from "@/lib/timeRanges";
import { cn } from "@/lib/utils";
import { getUsersByProviderOverTime } from "@/server/actions/admin/users/get-users-by-provider-over-time";
import { useSuspenseQuery } from "@tanstack/react-query";
import { ComponentProps } from "react";
import UserByProviderDistributionContent from "./user-by-provider-distribution-content";

type Props = ComponentProps<"div"> & {
  timeRange: TimeRange;
};

const GetUserByProvider = ({ className, timeRange, ...props }: Props) => {
  const { data } = useSuspenseQuery({
    queryKey: ["user-by-provider-distribution", timeRange],
    queryFn: () =>
      getUsersByProviderOverTime({
        timeRange: timeRange,
      }),
  });

  // if (isPending) {
  //   return <UserByProviderSkeleton />;
  // }

  return (
    <UserByProviderDistributionContent
      chartData={data?.data ?? []}
      className={cn("", className)}
      {...props}
    />
  );
};

export default GetUserByProvider;
