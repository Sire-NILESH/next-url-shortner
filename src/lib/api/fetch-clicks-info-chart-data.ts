import { BASE_URL } from "@/site-config/base-url";
import timeRanges from "../timeRanges";

type TimeRange = keyof typeof timeRanges | "all time";

export const fetchClicksInfoChartData = async (
  options: {
    timeRange?: TimeRange;
  } = { timeRange: "all time" }
) => {
  const searchParams = new URLSearchParams();

  if (options.timeRange) {
    searchParams.set("timeRange", options.timeRange);
  }

  const response = await fetch(
    `${BASE_URL}/api/v1/chart-data/clicks-info?${searchParams}`
  );
  return await response.json();
};
