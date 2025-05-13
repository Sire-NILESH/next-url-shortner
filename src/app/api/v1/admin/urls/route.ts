/* eslint-disable @typescript-eslint/no-explicit-any */
import { getAllUrls } from "@/server/actions/admin/urls/get-all-urls";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const options = {
      page: Number(searchParams.get("page")) || 1,
      limit: Number(searchParams.get("limit")) || 10,
      sortBy: (searchParams.get("sortBy") as any) || "createdAt",
      sortOrder: (searchParams.get("sortOrder") as any) || "desc",
      search: searchParams.get("search") || "",
      filter: (searchParams.get("filter") as any) || "all",
    };

    const response = await getAllUrls(options);
    return NextResponse.json(response);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
