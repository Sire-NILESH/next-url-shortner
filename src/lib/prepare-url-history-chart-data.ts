import { UrlsHistoryChartDataType, UserUrl } from "@/types/client/types";
import { sub, add, format, isAfter } from "date-fns";

type TimeRange = "24H" | "7D" | "30D" | "3M" | "6M" | "1Y" | "all time";

export const prepareUrlHistoryChartData = (
  data: UserUrl[],
  timeRange: TimeRange = "all time"
): {
  chartData: UrlsHistoryChartDataType[];
  totalUrls: number;
} => {
  if (!data.length) return { chartData: [], totalUrls: 0 };

  const now = new Date();
  let fromDate = new Date(2000, 0); // default all time

  switch (timeRange) {
    case "24H":
      fromDate = sub(now, { hours: 23 });
      break;
    case "7D":
      fromDate = sub(now, { days: 6 });
      break;
    case "30D":
      fromDate = sub(now, { days: 29 });
      break;
    case "3M":
      fromDate = sub(now, { months: 2 });
      break;
    case "6M":
      fromDate = sub(now, { months: 5 });
      break;
    case "1Y":
      fromDate = sub(now, { years: 1 });
      break;
    case "all time":
      fromDate = new Date(2023, 0); // or find from earliest `createdAt`
      break;
  }

  // Filter URLs in range
  const urls = data.filter((url) => isAfter(url.createdAt, fromDate));

  // Determine format and step
  let formatStr = "MMM yyyy";
  let stepUnit: "hour" | "day" | "month" | "year" = "month";
  let stepCount = 1;
  const timePoints: Map<string, number> = new Map();

  switch (timeRange) {
    case "24H":
      formatStr = "hh a";
      stepUnit = "hour";
      stepCount = 1;
      break;
    case "7D":
      formatStr = "EEE"; // Sun, Mon, etc.
      stepUnit = "day";
      stepCount = 1;
      break;
    case "30D":
      formatStr = "dd/MM";
      stepUnit = "day";
      break;
    case "3M":
    case "6M":
    case "1Y":
      formatStr = "MMM";
      stepUnit = "month";
      break;
    case "all time":
      formatStr = "yyyy";
      stepUnit = "year";
      stepCount = 1;
      break;
  }

  // Build time buckets
  const buckets: string[] = [];
  let cursor = new Date(fromDate);

  while (cursor <= now) {
    const key = format(cursor, formatStr);
    timePoints.set(key, 0);
    buckets.push(key);

    switch (stepUnit) {
      case "hour":
        cursor = add(cursor, { hours: stepCount });
        break;
      case "day":
        cursor = add(cursor, { days: stepCount });
        break;
      case "month":
        cursor = add(cursor, { months: stepCount });
        break;
      case "year": // <- ADD THIS
        cursor = add(cursor, { years: stepCount });
        break;
    }
  }

  // Count into buckets
  for (const url of urls) {
    const key = format(url.createdAt, formatStr);
    if (timePoints.has(key)) {
      timePoints.set(key, timePoints.get(key)! + 1);
    }
  }

  let totalUrls = 0;

  const chartData = buckets.map((period) => {
    const count = timePoints.get(period) ?? 0;
    totalUrls += count;
    return {
      period,
      urls: count,
    };
  });

  return {
    chartData,
    totalUrls,
  };
};
