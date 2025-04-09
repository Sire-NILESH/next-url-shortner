"use client";

import { cn } from "@/lib/utils";
import React, { ComponentProps } from "react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

type UserGrowthChartData = {
  period: string;
  users: number;
};

type Props = ComponentProps<"div"> & {
  chartData: UserGrowthChartData[];
};

const chartConfig = {
  users: {
    label: "Users",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

const UserGrowthChartContent = ({ className, chartData, ...props }: Props) => {
  return (
    <div className={cn("", className)} {...props}>
      <ChartContainer config={chartConfig} className="w-full h-64">
        <AreaChart
          accessibilityLayer
          data={chartData}
          margin={{
            left: 12,
            right: 12,
          }}
        >
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="period"
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            // tickFormatter={(value) => value.slice(0, 3)}
          />
          <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
          <defs>
            <linearGradient id="fillUsers" x1="0" y1="0" x2="0" y2="1">
              <stop
                offset="5%"
                stopColor="var(--color-users)"
                stopOpacity={0.8}
              />
              <stop
                offset="95%"
                stopColor="var(--color-users)"
                stopOpacity={0.1}
              />
            </linearGradient>
          </defs>
          <Area
            dataKey="users"
            type="natural"
            fill="url(#fillUsers)"
            fillOpacity={0.4}
            stroke="var(--color-users)"
            stackId="a"
          />
        </AreaChart>
      </ChartContainer>
    </div>
  );
};

export default UserGrowthChartContent;
