export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from "next/server";
import { getWeatherData } from "@/lib/weather-service";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const lat = searchParams.get("lat");
    const lon = searchParams.get("lon");
    
    if (!lat || !lon) {
      console.error('Missing required parameters:', { lat, lon });
      return NextResponse.json(
        { error: "Latitude and longitude are required" },
        { status: 400 }
      );
    }

    console.log('Fetching weather data for:', { lat, lon });

    const weatherData = await getWeatherData(
      parseFloat(lat),
      parseFloat(lon)
    );
    
    if (!weatherData) {
      console.error('No weather data returned from service for:', { lat, lon });
      return NextResponse.json(
        { error: "Failed to fetch weather data" },
        { status: 500 }
      );
    }

    console.log('Weather data fetched successfully:', {
      location: weatherData.location.name,
      country: weatherData.location.country,
      currentTemp: weatherData.current.temp,
      hasForecast: weatherData.forecast?.length > 0
    });
    
    return NextResponse.json(weatherData);
  } catch (error) {
    console.error("Weather API error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to fetch weather data" },
      { status: 500 }
    );
  }
}