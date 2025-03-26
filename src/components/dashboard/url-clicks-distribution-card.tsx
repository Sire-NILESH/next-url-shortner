import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { ChartPie, TrendingUp, TrendingDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { ComponentProps } from "react";
import { PieChart, Pie, Label } from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { UrlClicksPieChartDataType } from "@/types/client/types";

interface UrlClicksDistributionCardProps extends ComponentProps<"div"> {
  pieChartConfig: ChartConfig;
  pieChartData: UrlClicksPieChartDataType[];
  totalClicks: number;
  avgClicks: number;
  topUrlsLen: number;
  userUrlsLen: number;
}

export const UrlClicksDistributionCard = ({
  className,
  pieChartConfig,
  pieChartData,
  totalClicks,
  avgClicks,
  topUrlsLen,
  userUrlsLen,
  ...props
}: UrlClicksDistributionCardProps) => {
  return (
    <Card className={cn("flex flex-1 flex-col", className)} {...props}>
      <CardHeader className="flex flex-row gap-3 items-center pb-2">
        <ChartPie className="size-10 md:size-12 items-center rounded-lg p-2 text-green-500 bg-green-400/10" />
        <div className="space-y-1">
          <CardTitle>URL Clicks Distribution</CardTitle>
          <CardDescription>
            Top {topUrlsLen} URLs with most clicks
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={pieChartConfig}
          className="mx-auto aspect-square max-h-[350px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={pieChartData}
              dataKey="clicks"
              nameKey="url"
              innerRadius={60}
              strokeWidth={5}
            >
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-3xl font-bold"
                        >
                          {totalClicks.toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 20) + 20}
                          className="fill-muted-foreground text-xs mb-2"
                        >
                          Total Clicks
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 font-medium leading-none">
          {userUrlsLen > 0 &&
            (avgClicks > 5 ? (
              <>
                Trending up by {((avgClicks / 5) * 100).toFixed(1)}% this month
                <TrendingUp className="size-4 text-green-500" />
              </>
            ) : (
              <>
                Could improve with only {Math.ceil(5 - avgClicks)} more clicks
                <TrendingDown className="size-4 text-amber-500" />
              </>
            ))}
        </div>
        <div className="leading-none text-muted-foreground">
          Showing click count for your top {topUrlsLen} URLs
        </div>
      </CardFooter>
    </Card>
  );
};
