"use client";

import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { cn } from "@/lib/utils";
import { ComponentProps } from "react";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";

type ClicksInfoChart = {
  period: string;
  clicks: number;
  flaggedClicks: number;
};

type Props = ComponentProps<"div"> & {
  chartData: ClicksInfoChart[];
};

const chartConfig = {
  clicks: {
    label: "Clicks",
    color: "hsl(var(--chart-1))",
  },
  flaggedClicks: {
    label: "Flagged",
    color: "hsl(var(--chart-3))",
  },
} satisfies ChartConfig;

const ClicksInfoChartContent = ({ className, chartData, ...props }: Props) => {
  return (
    <div className={cn("", className)} {...props}>
      <ChartContainer config={chartConfig} className="h-64 w-full">
        <BarChart accessibilityLayer data={chartData}>
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="period"
            tickLine={false}
            tickMargin={10}
            axisLine={false}
          />
          <ChartTooltip content={<ChartTooltipContent />} />
          <ChartLegend content={<ChartLegendContent />} />
          <Bar
            dataKey="flaggedClicks"
            stackId="a"
            fill="var(--color-flaggedClicks)"
            radius={[0, 0, 4, 4]}
          />
          <Bar
            dataKey="clicks"
            stackId="a"
            fill="var(--color-clicks)"
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ChartContainer>
    </div>
  );
};

export default ClicksInfoChartContent;
