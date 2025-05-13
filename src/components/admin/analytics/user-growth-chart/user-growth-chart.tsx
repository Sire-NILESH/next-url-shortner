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
import { Suspense, useState } from "react";
import TimeRangeSelect from "../time-range-select";
import GetUserGrowth from "./get-user-growth";
import UserGrowthSkeleton from "./user-growth-skeleton";

export function UserGrowthLineAreaChart() {
  const [timeRange, setTimeRange] = useState<TimeRange>("6M");

  return (
    <Card className="bg-secondary/20">
      <CardHeader className="relative">
        <CardTitle>Audience Growth</CardTitle>
        <CardDescription>{getTimeRangeLabel(timeRange)}</CardDescription>

        <TimeRangeSelect
          className="absolute right-4 top-0"
          value={timeRange}
          onValueChange={(val: TimeRange) => setTimeRange(val)}
        />
      </CardHeader>
      <CardContent className="h-full">
        <Suspense fallback={<UserGrowthSkeleton />}>
          <GetUserGrowth timeRange={timeRange} />
        </Suspense>
      </CardContent>
      <CardFooter>
        <div className="flex w-full items-start gap-2 text-sm">
          <div className="grid gap-2">
            <div className="flex items-center gap-2 font-medium leading-none">
              Target 180+ new users per month
            </div>
            <div className="flex items-center gap-2 leading-none text-muted-foreground">
              {timeRange === "all time"
                ? "Showing user growth till today"
                : `Showing new users for the last ${timeRanges[timeRange]}`}
            </div>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
