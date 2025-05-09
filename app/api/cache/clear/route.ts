import { NextRequest, NextResponse } from "next/server";
import { clearAllWeatherCache } from "@/lib/redis";

// This endpoint is for development/testing purposes
export async function POST(request: NextRequest) {
  try {
    const result = await clearAllWeatherCache();
    
    return NextResponse.json(result);
  } catch (error) {
    console.error("Cache clear error:", error);
    return NextResponse.json(
      { error: "Failed to clear cache" },
      { status: 500 }
    );
  }
}