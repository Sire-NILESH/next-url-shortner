import { manageFlaggedUrl } from "@/server/actions/admin/urls/manage-flagged-url";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { urlId, action } = await req.json();

    if (!urlId || !action) {
      return NextResponse.json(
        { success: false, error: "Missing parameters" },
        { status: 400 }
      );
    }

    const response = await manageFlaggedUrl({ urlId, action });
    return NextResponse.json(response);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
