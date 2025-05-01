// file: app/api/admin/analytics/get-users-over-time/route.ts
import { TimeRangeSchema } from "@/lib/validations/TimeRangeSchema";
import { getUserGrowthChartData } from "@/server/services/admin/user/get-user-growth-chart-data.service";
import { authorizeRequest } from "@/server/services/auth/authorize-request-service";
import { UserGrowthResType } from "@/types/client/types";
import { ApiResponse } from "@/types/server/types";
import { NextRequest } from "next/server";

type ResponseType = ApiResponse<UserGrowthResType>;

export async function GET(req: NextRequest): Promise<Response> {
  try {
    const authResponse = await authorizeRequest({ allowedRoles: ["admin"] });

    if (!authResponse.success)
      return Response.json(authResponse satisfies ResponseType);

    const timeRangeSearchParam = req.nextUrl.searchParams.get("timeRange");
    const parsedTimeRange = TimeRangeSchema.safeParse(timeRangeSearchParam);

    if (!parsedTimeRange.success) {
      return Response.json({
        success: false,
        error: "Invalid timeRange param",
      } satisfies ResponseType);
    }

    const result = await getUserGrowthChartData({
      timeRange: parsedTimeRange.data,
    });

    return Response.json(result satisfies ResponseType);
  } catch (error) {
    console.error("Error fetching users over time:", error);
    return Response.json({
      success: false,
      error: "Internal Server Error",
    } satisfies ResponseType);
  }
}
