import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { ChartPie } from "lucide-react";
import { cn } from "@/lib/utils";
import { ComponentProps } from "react";
import { PieChart, Pie, Label, Sector } from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { UrlClicksPieChartDataType } from "@/types/client/types";
import { formatNumber } from "@/lib/formatNum";
import { PieSectorDataItem } from "recharts/types/polar/Pie";

interface UrlClicksDistributionCardProps extends ComponentProps<"div"> {
  pieChartConfig: ChartConfig;
  pieChartData: UrlClicksPieChartDataType[];
  totalClicks: number;
  topUrlsLen: number;
}

export const UrlClicksDistributionCard = ({
  className,
  pieChartConfig,
  pieChartData,
  totalClicks,
  topUrlsLen,
  ...props
}: UrlClicksDistributionCardProps) => {
  return (
    <Card className={cn("", className)} {...props}>
      <CardHeader className="flex flex-row gap-3 items-center pb-2">
        <ChartPie className="size-10 md:size-12 items-center rounded-lg p-2 text-green-500 bg-green-400/10" />
        <div className="space-y-1">
          <CardTitle>URL Clicks Distribution</CardTitle>
          <CardDescription>
            Top {topUrlsLen} URLs with most clicks
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="pb-0">
        <ChartContainer
          config={pieChartConfig}
          className="h-64 mx-auto aspect-auto"
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
              label
              labelLine={false}
              activeIndex={0}
              activeShape={({
                outerRadius = 0,
                ...props
              }: PieSectorDataItem) => (
                <Sector {...props} outerRadius={outerRadius + 10} />
              )}
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
                          {formatNumber(totalClicks)}
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
      <CardFooter>
        <div className="mx-auto text-center text-sm space-y-2">
          <p className="leading-none">
            {`${pieChartData[0].url} is your best performing url`}
          </p>
          <p className="leading-none text-muted-foreground">
            Showing click counts for your top {topUrlsLen} URLs till today
          </p>
        </div>
      </CardFooter>
    </Card>
  );
};
