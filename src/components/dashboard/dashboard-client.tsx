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
import SkeletonWrapper from "../skeleton-wrapper";
import { NewShrinkifyURLCard } from "./new-shrinkify-url-card";
import StatCard from "./stat-card";
import { UrlClicksDistributionCard } from "./url-clicks-distribution-card";
import { UrlsHistoryChart } from "./url-history-chart";
import DashboardClientErrorFallback from "./dashboard-client-error-fallback";

export default function DashboardClient() {
  const { data: userUrls, isLoading, error } = useMyUrls();

  // calculate total clicks
  const totalClicks = useMemo(
    () => (userUrls ? userUrls.reduce((sum, url) => sum + url.clicks, 0) : 0),
    [userUrls]
  );

  // calculate average clicks per URL
  const avgClicks = useMemo(
    () =>
      userUrls && totalClicks && userUrls.length > 0
        ? Math.round((totalClicks / userUrls.length) * 10) / 10
        : 0,
    [totalClicks, userUrls]
  );

  // get top performing URL
  const topUrls = useMemo(
    () =>
      userUrls
        ? [...userUrls].sort((a, b) => b.clicks - a.clicks).slice(0, 5)
        : [],
    [userUrls]
  );

  // prepare data for the pie chart with numerc values
  const pieChartData = useMemo(() => {
    return topUrls.map((url, index) => ({
      url: url.shortCode,
      clicks: url.clicks,
      fill: `hsl(var(--chart-${index + 1}))`,
    }));
  }, [topUrls]);

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

  if (error && !isLoading) {
    return <DashboardClientErrorFallback error={error} />;
  }

  return (
    <>
      <div className="grid gap-8 xl:grid-cols-3 mb-8">
        <SkeletonWrapper
          isLoading={isLoading}
          className="bg-secondary shadow-sm border border-border rounded-xl"
        >
          <StatCard
            value={userUrls ? userUrls.length : 0}
            title="Total URLs"
            description="Number of URLs you've created"
            icon={
              <Link className="size-10 md:size-12 items-center rounded-lg p-2 text-blue-500 bg-blue-500/10" />
            }
          />
        </SkeletonWrapper>

        <SkeletonWrapper
          isLoading={isLoading}
          className="bg-secondary shadow-sm border border-border rounded-xl"
        >
          <StatCard
            value={totalClicks}
            title="Total Clicks"
            description="Total clicks across all URLs"
            icon={
              <MousePointerClick className="size-10 md:size-12 items-center rounded-lg p-2 text-emerald-500 bg-emerald-400/10" />
            }
          />
        </SkeletonWrapper>

        <SkeletonWrapper
          isLoading={isLoading}
          className="bg-secondary shadow-sm border border-border rounded-xl"
        >
          <StatCard
            value={avgClicks}
            title="Average Clicks"
            description="Average clicks per URL"
            icon={
              <EqualApproximately className="size-10 md:size-12 items-center rounded-lg p-2 text-yellow-500 bg-yellow-400/10" />
            }
          />
        </SkeletonWrapper>
      </div>

      <Card className="bg-transparent border-transparent shadow-none sm:bg-card sm:border-border sm:shadow-sm">
        <CardHeader className="px-2 sm:px-6">
          <CardTitle>URL Performance</CardTitle>
          <CardDescription>
            Take a glance at how your urls are performing
          </CardDescription>
        </CardHeader>

        <CardContent className="px-0 sm:px-6">
          <>
            <SkeletonWrapper isLoading={isLoading} className="rounded-xl">
              <div className="grid grid-cols-1 xl:grid-cols-3 gap-10">
                <NewShrinkifyURLCard className="bg-card sm:bg-secondary/40" />
                {userUrls && userUrls.length > 0 ? (
                  <>
                    <UrlsHistoryChart
                      userUrls={userUrls}
                      className="bg-card sm:bg-secondary/40"
                    />

                    <UrlClicksDistributionCard
                      className="bg-card sm:bg-secondary/40"
                      pieChartConfig={pieChartConfig}
                      pieChartData={pieChartData}
                      topUrlsLen={topUrls.length}
                      totalClicks={totalClicks}
                    />
                  </>
                ) : (
                  <div className="col-span-1 xl:col-span-2 flex flex-col items-center justify-center space-y-2 rounded-xl text-center py-8 bg-muted shadow">
                    <p className="text-2xl !font-bold boldText">
                      No url data available yet
                    </p>

                    <p className="text-base text-muted-foreground">
                      Create some shrinkify URLs to see the stats
                    </p>
                  </div>
                )}
              </div>
            </SkeletonWrapper>
          </>
        </CardContent>
      </Card>
    </>
  );
}
