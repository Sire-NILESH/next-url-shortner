import { format, sub } from "date-fns";

const timeRanges = {
  "24H": "1 day",
  "7D": "7 days",
  "30D": "30 days",
  "3M": "3 months",
  "6M": "6 months",
  "1Y": "1 year",
} as const;

export default timeRanges;

export type TimeRange = "24H" | "7D" | "30D" | "3M" | "6M" | "1Y" | "all time";

export function getTimeRangeLabel(range: TimeRange): string {
  const now = new Date();

  switch (range) {
    case "24H": {
      const from = sub(now, { hours: 24 });
      return `${format(from, "dd MMM hh aaaa")} - ${format(
        now,
        "dd MMM hh aaaa"
      )}`;
    }
    case "7D": {
      const from = sub(now, { days: 6 }); // include today
      return `${format(from, "EEE dd MMM")} - ${format(now, "EEE dd MMM")}`;
    }
    case "30D": {
      const from = sub(now, { days: 29 });
      return `${format(from, "dd MMM")} - ${format(now, "dd MMM")}`;
    }
    case "3M": {
      const from = sub(now, { months: 2 });
      return `${format(from, "MMM yyyy")} - ${format(now, "MMM yyyy")}`;
    }
    case "6M": {
      const from = sub(now, { months: 5 });
      return `${format(from, "MMM yyyy")} - ${format(now, "MMM yyyy")}`;
    }
    case "1Y": {
      const from = sub(now, { months: 11 });
      return `${format(from, "MMM yyyy")} - ${format(now, "MMM yyyy")}`;
    }
    case "all time": {
      return format(now, "dd MMMM yyyy, hh:mm aaaa");
    }
    default:
      return "";
  }
}
