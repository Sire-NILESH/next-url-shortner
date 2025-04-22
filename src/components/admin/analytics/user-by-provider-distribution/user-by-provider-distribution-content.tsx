import { capitalizeFirstLetter, cn } from "@/lib/utils";
import React, { ComponentProps, useMemo } from "react";
import { Label, Pie, PieChart } from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

type UserByProviderDistributionData = {
  providerType: string;
  users: number;
};

type Props = ComponentProps<"div"> & {
  chartData: UserByProviderDistributionData[];
};

const UserByProviderDistributionContent = ({
  className,
  chartData,
  ...props
}: Props) => {
  const totalUsers = React.useMemo(() => {
    return chartData.reduce((acc, curr) => acc + curr.users, 0);
  }, [chartData]);

  // pie chart config
  const pieChartConfig = {
    users: {
      label: "Users",
    },
    ...chartData.reduce((acc, curr, index) => {
      acc[curr.providerType] = {
        label: capitalizeFirstLetter(curr.providerType),
        color: `var(--chart-${index + 1})`,
      };
      return acc;
    }, {} as ChartConfig),
  };

  // prepare data for the pie chart with numerc values
  const pieChartData = useMemo(() => {
    return chartData.map((curr, index) => ({
      providerType: curr.providerType,
      users: curr.users,
      fill: `hsl(var(--chart-${index + 1}))`,
    }));
  }, [chartData]);

  return (
    <div className={cn("", className)} {...props}>
      <ChartContainer
        config={pieChartConfig}
        className="mx-auto aspect-square h-64"
      >
        <PieChart>
          {chartData.length === 1 &&
          chartData[0].providerType === "None" ? null : (
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
          )}

          <ChartLegend content={<ChartLegendContent />} />

          <Pie
            data={pieChartData}
            dataKey="users"
            nameKey="providerType"
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
                        {chartData.length === 1 &&
                        chartData[0].providerType === "None"
                          ? "0"
                          : totalUsers.toLocaleString()}
                      </tspan>
                      <tspan
                        x={viewBox.cx}
                        y={(viewBox.cy || 0) + 24}
                        className="fill-muted-foreground"
                      >
                        Users
                      </tspan>
                    </text>
                  );
                }
              }}
            />
          </Pie>
        </PieChart>
      </ChartContainer>
    </div>
  );
};

export default UserByProviderDistributionContent;
