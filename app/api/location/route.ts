export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from "next/server";
import { searchLocation } from "@/lib/weather-service";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q");
    
    if (!query) {
      return NextResponse.json(
        { error: "Search query is required" },
        { status: 400 }
      );
    }
    
    const locations = await searchLocation(query);
    
    if (locations.length === 0) {
      return NextResponse.json(
        { error: "No locations found" },
        { status: 404 }
      );
    }
    
    return NextResponse.json(locations);
  } catch (error) {
    console.error("Location search error:", error);
    return NextResponse.json(
      { error: "Failed to search for locations" },
      { status: 500 }
    );
  }
}