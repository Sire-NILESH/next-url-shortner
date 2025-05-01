// src/app/api/analytics/users/by-provider/route.ts
import { TimeRangeSchema } from "@/lib/validations/TimeRangeSchema";
import { getUsersByProviderChartData } from "@/server/services/admin/user/get-user-by-provider-chart-data.service";

import { UsersByProviderResType } from "@/types/client/types";
import { ApiResponse } from "@/types/server/types";
import { NextRequest } from "next/server";

type ResponseType = ApiResponse<UsersByProviderResType>;

export async function GET(req: NextRequest): Promise<Response> {
  try {
    const timeRangeSearchParam = req.nextUrl.searchParams.get("timeRange");

    const parsedTimeRange = TimeRangeSchema.safeParse(timeRangeSearchParam);

    if (!parsedTimeRange.success) {
      return Response.json({
        success: false,
        error: "Invalid timeRange param",
      } satisfies ResponseType);
    }

    const result = await getUsersByProviderChartData({
      timeRange: parsedTimeRange.data,
    });

    return Response.json(result satisfies ResponseType);
  } catch (error) {
    console.error("Error in GET /users/by-provider:", error);
    return Response.json({
      success: false,
      error: "Internal Server Error",
    } satisfies ResponseType);
  }
}
