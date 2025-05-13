import { z } from "zod";

export const TimeRangeSchema = z
  .enum(["24H", "7D", "30D", "3M", "6M", "1Y", "all time"])
  .nullable();
