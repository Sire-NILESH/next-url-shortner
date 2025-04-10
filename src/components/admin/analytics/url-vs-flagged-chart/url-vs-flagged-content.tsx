"use client";

import { cn } from "@/lib/utils";
import React, { ComponentProps } from "react";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";

type UrlVsFlaggedChartData = {
  period: string;
  urls: number;
  flaggedUrls: number;
};

type Props = ComponentProps<"div"> & {
  chartData: UrlVsFlaggedChartData[];
};

const chartConfig = {
  urls: {
    label: "URLs",
    color: "hsl(var(--chart-1))",
  },
  flaggedUrls: {
    label: "Flagged",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

const UrlVsFlaggedContent = ({ className, chartData, ...props }: Props) => {
  return (
    <div className={cn("", className)} {...props}>
      <ChartContainer config={chartConfig} className="aspect-auto h-64 w-full">
        <AreaChart data={chartData}>
          <defs>
            <linearGradient id="fillUrls" x1="0" y1="0" x2="0" y2="1">
              <stop
                offset="5%"
                stopColor="var(--color-urls)"
                stopOpacity={1.0}
              />
              <stop
                offset="95%"
                stopColor="var(--color-urls)"
                stopOpacity={0.2}
              />
            </linearGradient>
            <linearGradient id="fillFlaggedUrls" x1="0" y1="0" x2="0" y2="1">
              <stop
                offset="5%"
                stopColor="var(--color-flaggedUrls)"
                stopOpacity={0.8}
              />
              <stop
                offset="95%"
                stopColor="var(--color-flaggedUrls)"
                stopOpacity={0.2}
              />
            </linearGradient>
          </defs>
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="period"
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            minTickGap={32}
          />
          <ChartTooltip
            cursor={false}
            content={<ChartTooltipContent indicator="dot" />}
          />

          <Area
            dataKey="urls"
            type="natural"
            fill="url(#fillUrls)"
            stroke="var(--color-urls)"
            stackId="a"
          />

          <Area
            dataKey="flaggedUrls"
            type="natural"
            fill="url(#fillFlaggedUrls)"
            stroke="var(--color-flaggedUrls)"
            stackId="b"
          />
        </AreaChart>
      </ChartContainer>
    </div>
  );
};

export default UrlVsFlaggedContent;
