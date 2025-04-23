import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { ChartNoAxesColumn, TrendingUp, TrendingDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { ComponentProps } from "react";
import { BarChart, Bar, CartesianGrid, XAxis, Cell } from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { UrlClicksBarChartDataType } from "@/types/client/types";

interface UrlClicksBarChartCardProps extends ComponentProps<"div"> {
  barChartConfig: ChartConfig;
  barChartData: UrlClicksBarChartDataType[];
  avgClicks: number;
  topUrlsLen: number;
}

export const UrlClicksBarChartCard = ({
  className,
  barChartConfig,
  barChartData,
  avgClicks,
  topUrlsLen,
  ...props
}: UrlClicksBarChartCardProps) => {
  return (
    <Card className={cn("", className)} {...props}>
      <CardHeader className="flex flex-row gap-3 items-center pb-2">
        <ChartNoAxesColumn className="size-10 md:size-12 items-center rounded-lg p-2 text-purple-500 bg-purple-400/10" />
        <div className="space-y-1">
          <CardTitle>URL Performance</CardTitle>
          <CardDescription>Top 5 URLs with most clicks</CardDescription>
        </div>
      </CardHeader>
      <CardContent className="pb-0">
        <ChartContainer
          className="h-64 mx-auto aspect-auto"
          config={barChartConfig}
        >
          <BarChart accessibilityLayer data={barChartData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="url"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  indicator="dashed"
                  labelFormatter={(label) => `URL: ${label}`}
                />
              }
            />
            <Bar dataKey={"clicks"} radius={4}>
              {barChartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={`hsl(var(--chart-${index + 1}))`}
                />
              ))}
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 font-medium leading-none">
          {avgClicks > 5 ? (
            <>
              Trending up by {((avgClicks / 5) * 100).toFixed(1)}% this month
              <TrendingUp className="size-4 text-green-500" />
            </>
          ) : (
            <>
              Could improve with only {Math.ceil(5 - avgClicks)} more clicks
              <TrendingDown className="size-4 text-amber-500" />
            </>
          )}
        </div>
        <div className="leading-none text-muted-foreground">
          Showing click count for your top {topUrlsLen} URLs
        </div>
      </CardFooter>
    </Card>
  );
};
