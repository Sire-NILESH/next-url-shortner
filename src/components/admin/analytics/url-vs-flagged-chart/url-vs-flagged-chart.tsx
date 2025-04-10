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
import GetUrlVsFlagged from "./get-url-vs-flagged";
import UrlVsFlaggedSkeleton from "./url-vs-flagged-skeleton";

function UrlVsFlaggedChart() {
  const [timeRange, setTimeRange] = useState<TimeRange>("6M");

  return (
    <Card>
      <CardHeader className="relative">
        <CardTitle>URLs VS Flagged URLs</CardTitle>
        <CardDescription>
          {timeRange === "all time"
            ? "URLs vs Flagged URLs till today"
            : `Showing URLs types for the last ${timeRanges[timeRange]}`}
        </CardDescription>

        <TimeRangeSelect
          className="absolute right-4 top-0"
          value={timeRange}
          onValueChange={(val: TimeRange) => setTimeRange(val)}
        />
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <Suspense fallback={<UrlVsFlaggedSkeleton />}>
          <GetUrlVsFlagged timeRange={timeRange} />
        </Suspense>
      </CardContent>

      <CardFooter>
        <div className="flex w-full items-start gap-2 text-sm">
          <div className="grid gap-2">
            <div className="flex items-center gap-2 font-medium leading-none">
              Minimise the Flagged URL quantity
            </div>
            <div className="flex items-center gap-2 leading-none text-muted-foreground">
              {getTimeRangeLabel(timeRange)}
            </div>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}

export default UrlVsFlaggedChart;
