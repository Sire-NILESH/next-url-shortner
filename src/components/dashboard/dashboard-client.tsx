"use client";

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
import { CoreUrlShortner } from "@/components/urls/core-url-shortner/core-url-shortner";
import {
  EqualApproximately,
  Link,
  MousePointerClick,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import { useMemo } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Label,
  Pie,
  PieChart,
  XAxis,
} from "recharts";
import StatCard from "./stat-card";

interface Url {
  id: number;
  originalUrl: string;
  shortCode: string;
  createdAt: Date;
  clicks: number;
}

export default function DashboardClient({ userUrls }: { userUrls: Url[] }) {
  // calculate total clicks
  const totalClicks = useMemo(
    () => userUrls.reduce((sum, url) => sum + url.clicks, 0),
    [userUrls]
  );

  // calculate average clicks per URL
  const avgClicks = useMemo(
    () =>
      userUrls.length > 0
        ? Math.round((totalClicks / userUrls.length) * 10) / 10
        : 0,
    [totalClicks, userUrls.length]
  );

  // get top performing URL
  const topUrls = useMemo(
    () => [...userUrls].sort((a, b) => b.clicks - a.clicks).slice(0, 5),
    [userUrls]
  );

  // prepare data for the bar chart with numeric values
  const barChartData = useMemo(() => {
    return topUrls.map((url) => ({
      url: url.shortCode,
      clicks: url.clicks,
      originalUrl: url.originalUrl,
    }));
  }, [topUrls]);

  // prepare data for the pie chart with numerc values
  const pieChartData = useMemo(() => {
    return topUrls.map((url, index) => ({
      browser: url.shortCode,
      vistors: url.clicks,
      fill: `hsl(var(--chart-${index + 1}))`,
    }));
  }, [topUrls]);

  // bar chart config
  const barChartConfig = {
    clicks: {
      label: "Clicks",
      color: "var(--chart-1)",
    },
    ...topUrls.reduce((acc, url, index) => {
      acc[url.shortCode] = {
        label: url.shortCode,
        color: `var(--chart-${index + 1})`,
      };
      return acc;
    }, {} as ChartConfig),
  };

  // pie chart config
  const pieChartConfig = {
    visitors: {
      label: "Clicks",
    },
    ...topUrls.reduce((acc, url, index) => {
      acc[url.shortCode] = {
        label: url.shortCode,
        color: `var(--chart-${index + 1})`,
      };
      return acc;
    }, {} as ChartConfig),
  };
  return (
    <>
      <div className="grid gap-8 xl:grid-cols-3 mb-8">
        <StatCard
          value={userUrls.length}
          title="Total URLs"
          description="Number of URLs you've created"
          icon={
            <Link className="size-12 items-center rounded-lg p-2 text-blue-500 bg-blue-500/10" />
          }
        />

        <StatCard
          value={totalClicks}
          title="Total Clicks"
          description="Total clicks across all URLs"
          icon={
            <MousePointerClick className="size-12 items-center rounded-lg p-2 text-emerald-500 bg-emerald-400/10" />
          }
        />

        <StatCard
          value={avgClicks}
          title="Average Clicks"
          description="Average clicks per URL"
          icon={
            <EqualApproximately className="size-12 items-center rounded-lg p-2 text-yellow-500 bg-yellow-400/10" />
          }
        />
      </div>

      <Card className="shadow-sm">
        <CardHeader className="px-4 md:px-6">
          <CardTitle>Top Performing URLs</CardTitle>
          <CardDescription>
            Showing top 5 most performing URLs with highest clicks
          </CardDescription>
        </CardHeader>
        <CardContent className="px-4 md:px-6">
          {barChartData.length > 0 ? (
            <>
              <div className="flex flex-col xl:flex-row gap-10">
                <Card className="flex-1">
                  <CardHeader className="text-center">
                    <CardTitle className="text-lg">
                      Create New Shrinkify URL
                    </CardTitle>
                    <CardDescription>
                      Enter a long URL to create a shrinkify link.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <CoreUrlShortner />
                  </CardContent>
                </Card>

                <Card className="flex flex-1 flex-col text-center">
                  <CardHeader>
                    <CardTitle className="text-lg">URL Perfomance</CardTitle>
                    <CardDescription>
                      Top 5 URLs with most clicks
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex-1 pb-0">
                    <ChartContainer config={barChartConfig}>
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
                          Trending up by {((avgClicks / 5) * 100).toFixed(1)}%
                          this month{" "}
                          <TrendingUp className="size-4 text-green-500" />
                        </>
                      ) : (
                        <>
                          Could improve with only {Math.ceil(5 - avgClicks)}{" "}
                          more clicks{" "}
                          <TrendingDown className="size-4 text-amber-500" />
                        </>
                      )}
                    </div>
                    <div className="leading-none text-muted-foreground">
                      Showing click count for your top {topUrls.length} URLs
                    </div>
                  </CardFooter>
                </Card>

                <Card className="flex flex-1 flex-col">
                  <CardHeader className="items-center pb-0">
                    <CardTitle className="text-lg">
                      URL Clicks Distrubtion
                    </CardTitle>
                    <CardDescription>
                      Top {topUrls.length} URLs with most clicks
                    </CardDescription>
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
                          dataKey="vistors"
                          nameKey="browser"
                          innerRadius={60}
                          strokeWidth={5}
                        >
                          <Label
                            content={({ viewBox }) => {
                              if (
                                viewBox &&
                                "cx" in viewBox &&
                                "cy" in viewBox
                              ) {
                                return (
                                  <text
                                    x={viewBox.cx}
                                    y={viewBox.cy}
                                    textAnchor="middle"
                                    dominantBaseline={"middle"}
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
                          ></Label>
                        </Pie>
                      </PieChart>
                    </ChartContainer>
                  </CardContent>
                  <CardFooter className="flex-col gap-2 text-sm">
                    <div className="flex items-center gap-2 font-medium leading-none">
                      {userUrls.length > 0 && (
                        <>
                          {avgClicks > 5 ? (
                            <>
                              Trending up by{" "}
                              {((avgClicks / 5) * 100).toFixed(1)}% this month{" "}
                              <TrendingUp className="size-4 text-green-500" />
                            </>
                          ) : (
                            <>
                              Could improve with only {Math.ceil(5 - avgClicks)}{" "}
                              more clicks{" "}
                              <TrendingDown className="size-4 text-amber-500" />
                            </>
                          )}
                        </>
                      )}
                    </div>
                    <div className="leading-none text-muted-foreground">
                      Showing click count for your top {topUrls.length} URLs
                    </div>
                  </CardFooter>
                </Card>
              </div>
            </>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              No URL data available yet. Create some short URLs to see the
              stats.
            </div>
          )}
        </CardContent>
      </Card>
    </>
  );
}
