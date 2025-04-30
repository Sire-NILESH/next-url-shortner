"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ChartConfig } from "@/components/ui/chart";
import useMyUrls from "@/hooks/useMyUrls";
import { EqualApproximately, Link, MousePointerClick } from "lucide-react";
import { useMemo } from "react";
import { NewShrinkifyURLCard } from "./new-shrinkify-url-card";
import StatCard from "./stat-card";
import { UrlClicksBarChartCard } from "./url-clicks-bar-chart-card";
import { UrlClicksDistributionCard } from "./url-clicks-distribution-card";

export default function DashboardClient() {
  const { data: userUrls } = useMyUrls();

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
      url: url.shortCode,
      clicks: url.clicks,
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
        label: url.name ?? url.shortCode,
        color: `var(--chart-${index + 1})`,
      };
      return acc;
    }, {} as ChartConfig),
  };

  // pie chart config
  const pieChartConfig = {
    clicks: {
      label: "Clicks",
    },
    ...topUrls.reduce((acc, url, index) => {
      acc[url.shortCode] = {
        label: url.name ?? url.shortCode,
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
            <Link className="size-10 md:size-12 items-center rounded-lg p-2 text-blue-500 bg-blue-500/10" />
          }
        />

        <StatCard
          value={totalClicks}
          title="Total Clicks"
          description="Total clicks across all URLs"
          icon={
            <MousePointerClick className="size-10 md:size-12 items-center rounded-lg p-2 text-emerald-500 bg-emerald-400/10" />
          }
        />

        <StatCard
          value={avgClicks}
          title="Average Clicks"
          description="Average clicks per URL"
          icon={
            <EqualApproximately className="size-10 md:size-12 items-center rounded-lg p-2 text-yellow-500 bg-yellow-400/10" />
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
          <>
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-10">
              <NewShrinkifyURLCard className="bg-secondary/40" />
              {barChartData.length > 0 ? (
                <>
                  <UrlClicksBarChartCard
                    className="bg-secondary/40"
                    avgClicks={avgClicks}
                    barChartConfig={barChartConfig}
                    barChartData={barChartData}
                    topUrlsLen={topUrls.length}
                  />

                  <UrlClicksDistributionCard
                    className="bg-secondary/40"
                    avgClicks={avgClicks}
                    pieChartConfig={pieChartConfig}
                    pieChartData={pieChartData}
                    topUrlsLen={topUrls.length}
                    userUrlsLen={userUrls.length}
                    totalClicks={totalClicks}
                  />
                </>
              ) : (
                <div className="col-span-1 xl:col-span-2 flex flex-col items-center justify-center space-y-2 rounded-xl text-center py-8 bg-muted">
                  <p className="text-2xl !font-bold boldText">
                    No url data available yet
                  </p>

                  <p className="text-base text-muted-foreground">
                    Create some shrinkify URLs to see the stats
                  </p>
                </div>
              )}
            </div>
          </>
        </CardContent>
      </Card>
    </>
  );
}
