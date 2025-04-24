import { TimeRangeValidator } from "@/lib/timeRanges";
import { getUrlVsFlaggedChartData } from "@/server/services/admin/url/get-url-vs-flagged-chart-data.service";
import { authorizeRequest } from "@/server/services/auth/authorize-request-service";
import { UrlVsFlaggedRouteResType } from "@/types/client/types";
import { ApiResponse } from "@/types/server/types";
import { NextRequest } from "next/server";

type ResponseType = ApiResponse<UrlVsFlaggedRouteResType>;

export async function GET(req: NextRequest): Promise<Response> {
  try {
    const authResponse = await authorizeRequest({
      allowedRoles: ["admin"],
    });

    if (!authResponse.success)
      return Response.json(authResponse satisfies ResponseType);

    const timeRangeSearchParam = req.nextUrl.searchParams.get("timeRange");

    const parsedTimeRange = TimeRangeValidator.safeParse(timeRangeSearchParam);

    if (!parsedTimeRange.success)
      return Response.json({
        success: false,
        error: "Invalid timeRange param",
      } satisfies ResponseType);

    const timeRange = parsedTimeRange.data;

    const result = await getUrlVsFlaggedChartData({ timeRange });

    return Response.json(result satisfies ResponseType);
  } catch (error) {
    console.error(`Error in : ${req.nextUrl.pathname}`, error);
    return Response.json({
      success: false,
      error: "Internal Server Error",
    } satisfies ResponseType);
  }
}
