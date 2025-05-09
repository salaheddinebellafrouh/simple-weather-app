import { format } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { WeatherIcon } from "@/components/weather-icon";
import { WeatherData } from "@/types/weather";

interface ForecastWeatherProps {
  data: WeatherData | null;
  isLoading?: boolean;
}

export function ForecastWeather({ data, isLoading = false }: ForecastWeatherProps) {
  if (isLoading) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <Skeleton className="h-8 w-48" />
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {Array(5).fill(0).map((_, i) => (
              <Skeleton key={i} className="h-36 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }
  
  if (!data || !data.forecast || data.forecast.length === 0) {
    return null;
  }
  
  return (
    <Card className="w-full max-w-2xl mx-auto mt-6 transition-all duration-300 hover:shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl">5-Day Forecast</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 transition-all">
          {data.forecast.map((day, index) => {
            const date = new Date(day.dt * 1000);
            return (
              <div
                key={day.dt}
                className="bg-muted/50 rounded-lg p-4 flex flex-col items-center transition-transform duration-300 hover:transform hover:scale-105"
              >
                <span className="font-medium text-sm">
                  {index === 0 ? 'Today' : format(date, 'EEE')}
                </span>
                <span className="text-xs text-muted-foreground mb-2">
                  {format(date, 'MMM d')}
                </span>
                <WeatherIcon iconCode={day.weather.icon} className="h-8 w-8 my-2" />
                <div className="text-center">
                  <div className="flex justify-between items-center w-full mt-2">
                    <span className="text-sm font-medium">{Math.round(day.temp.max)}°</span>
                    <span className="text-xs text-muted-foreground ml-2">{Math.round(day.temp.min)}°</span>
                  </div>
                  <p className="text-xs capitalize mt-1">{day.weather.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}