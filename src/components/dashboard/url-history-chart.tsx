import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { prepareUrlHistoryChartData } from "@/lib/prepare-url-history-chart-data";
import { getTimeRangeLabel, TimeRange } from "@/lib/timeRanges";
import { cn } from "@/lib/utils";
import { UserUrl } from "@/types/client/types";
import { History } from "lucide-react";
import { ComponentProps, useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
  XAxis,
  YAxis,
} from "recharts";
import TimeRangeSelect from "../admin/analytics/time-range-select";

interface UrlsHistoryChartProps extends ComponentProps<"div"> {
  userUrls: UserUrl[];
}

const urlHistoryChartConfig = {
  urls: {
    label: "URLs",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

export const UrlsHistoryChart = ({
  className,
  userUrls,
  ...props
}: UrlsHistoryChartProps) => {
  const [timeRange, setTimeRange] = useState<TimeRange>("6M");

  const { chartData, totalUrls } = useMemo(() => {
    return prepareUrlHistoryChartData(userUrls, timeRange);
  }, [userUrls, timeRange]);

  return (
    <Card className={cn("@container", className)} {...props}>
      <CardHeader className="relative flex flex-row gap-3 items-center pb-2">
        <History className="size-10 md:size-12 items-center rounded-lg p-2 text-purple-500 bg-purple-400/10" />
        <div className="space-y-1">
          <CardTitle>URL History</CardTitle>
          <CardDescription className="hidden @md:block">
            {"Your urls generated over time"}
          </CardDescription>
          <CardDescription className="block @md:hidden">
            {"Your urls over time"}
          </CardDescription>
        </div>

        <TimeRangeSelect
          className="absolute right-4 top-0"
          value={timeRange}
          onValueChange={(val: TimeRange) => setTimeRange(val)}
        />
      </CardHeader>
      <CardContent className="pb-0">
        <ChartContainer
          className="h-64 mx-auto aspect-auto"
          config={urlHistoryChartConfig}
        >
          <BarChart
            accessibilityLayer
            data={chartData}
            layout="vertical"
            margin={{
              left: -10,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis type="number" dataKey="urls" hide />
            <YAxis
              dataKey="period"
              type="category"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
            />

            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <Bar dataKey="urls" fill="var(--color-urls)" radius={5}>
              <LabelList
                dataKey="urls"
                position="right"
                offset={8}
                className="fill-foreground"
                fontSize={timeRange === "30D" || timeRange === "24H" ? 10 : 12}
              />
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter>
        <div className="mx-auto text-center text-sm space-y-2">
          <p className="leading-none">
            {`${totalUrls} URLs generated over this period`}
          </p>
          <p className="leading-none text-muted-foreground">
            {getTimeRangeLabel(timeRange)}
          </p>
        </div>
      </CardFooter>
    </Card>
  );
};
