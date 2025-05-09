import { NextRequest, NextResponse } from "next/server";
import { setRedisEnabled } from "@/lib/redis-state";

// Global variable to track Redis state
let redisEnabled = true;

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const { enabled } = await request.json();
    setRedisEnabled(enabled);
    
    return NextResponse.json({ enabled });
  } catch (error) {
    console.error("Redis toggle error:", error);
    return NextResponse.json(
      { error: "Failed to toggle Redis" },
      { status: 500 }
    );
  }
}

export function isRedisEnabled() {
  return redisEnabled;
} 