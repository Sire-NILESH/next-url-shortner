"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import timeRanges, { getTimeRangeLabel, TimeRange } from "@/lib/timeRanges";
import { cn } from "@/lib/utils";
import { ComponentProps, Suspense, useState } from "react";
import TimeRangeSelect from "../time-range-select";
import GetUserByProvider from "./get-user-by-provider";
import UserByProviderSkeleton from "./user-by-provider-skeleton";

type Props = ComponentProps<"div">;

const UserByProviderDistribution = ({ className, ...props }: Props) => {
  const [timeRange, setTimeRange] = useState<TimeRange>("6M");

  return (
    <Card className={cn("flex flex-col bg-secondary/20", className)} {...props}>
      <CardHeader className="relative pb-0">
        <CardTitle>Users By Providers</CardTitle>
        <CardDescription>{getTimeRangeLabel(timeRange)}</CardDescription>

        <TimeRangeSelect
          className="absolute right-4 top-0"
          value={timeRange}
          onValueChange={(val: TimeRange) => setTimeRange(val)}
        />
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <Suspense fallback={<UserByProviderSkeleton />}>
          <GetUserByProvider timeRange={timeRange} />
        </Suspense>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 font-medium leading-none">
          Target OAuth providers user base growth
        </div>
        <div className="leading-none text-muted-foreground">
          {timeRange === "all time"
            ? "Showing users per Providers till today"
            : `Showing users per Providers for the last ${timeRanges[timeRange]}`}
        </div>
      </CardFooter>
    </Card>
  );
};

export default UserByProviderDistribution;
