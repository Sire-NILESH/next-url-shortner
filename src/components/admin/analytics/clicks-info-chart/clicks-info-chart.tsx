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
import ClicksInfoSkeleton from "./clicks-info-skeleton";
import GetClicksInfo from "./get-clicks-info";

function ClicksInfoChart() {
  const [timeRange, setTimeRange] = useState<TimeRange>("6M");

  return (
    <Card className="bg-secondary/20">
      <CardHeader className="relative">
        <CardTitle>Clicks Info</CardTitle>
        <CardDescription>{getTimeRangeLabel(timeRange)}</CardDescription>

        <TimeRangeSelect
          className="absolute right-4 top-0"
          value={timeRange}
          onValueChange={(val: TimeRange) => setTimeRange(val)}
        />
      </CardHeader>
      <CardContent className="px-2 sm:px-6">
        <Suspense fallback={<ClicksInfoSkeleton />}>
          <GetClicksInfo timeRange={timeRange} />
        </Suspense>
      </CardContent>

      <CardFooter>
        <div className="flex w-full items-start gap-2 text-sm">
          <div className="grid gap-2">
            <div className="flex items-center gap-2 font-medium leading-none">
              Watchout for flagged clicks spikes
            </div>
            <div className="flex items-center gap-2 leading-none text-muted-foreground">
              {timeRange === "all time"
                ? "URLs vs Flagged URLs till today"
                : `Showing click activities for the last ${timeRanges[timeRange]}`}
            </div>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}

export default ClicksInfoChart;
