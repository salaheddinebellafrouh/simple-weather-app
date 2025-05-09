import { format } from "date-fns";
import { WeatherIcon } from "@/components/weather-icon";
import { CacheIndicator } from "@/components/cache-indicator";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { WeatherData } from "@/types/weather";
import { 
  Thermometer, 
  Droplets, 
  Wind,
  MapPin,
  Calendar
} from "lucide-react";

interface CurrentWeatherProps {
  data: WeatherData | null;
  isLoading?: boolean;
}

export function CurrentWeather({ data, isLoading = false }: CurrentWeatherProps) {
  if (isLoading) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader className="pb-2">
          <Skeleton className="h-8 w-48" />
        </CardHeader>
        <CardContent>
          <div className="flex flex-col space-y-3">
            <Skeleton className="h-16 w-full" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-24 w-full" />
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  if (!data) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Weather data unavailable</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Unable to load weather data. Please try again later.</p>
        </CardContent>
      </Card>
    );
  }
  
  const { current, location, cached, cachedAt } = data;
  const date = new Date(current.dt * 1000);
  
  return (
    <Card className="w-full max-w-2xl mx-auto transition-all duration-300 hover:shadow-lg">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div className="flex flex-col">
            <div className="flex items-center">
              <CardTitle className="text-2xl font-bold">
                {location.name}, {location.country}
              </CardTitle>
              <CacheIndicator cached={cached} cachedAt={cachedAt} />
            </div>
            <div className="flex items-center text-muted-foreground mt-1">
              <MapPin className="h-4 w-4 mr-1" />
              <span className="text-sm">
                {location.lat.toFixed(2)}°, {location.lon.toFixed(2)}°
              </span>
              <span className="mx-2">•</span>
              <Calendar className="h-4 w-4 mr-1" />
              <span className="text-sm">
                {format(date, "EEEE, MMMM d, yyyy p")}
              </span>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center justify-center md:justify-start">
            <div className="flex flex-col items-center md:items-start">
              <div className="flex items-center">
                <WeatherIcon iconCode={current.weather.icon} className="h-16 w-16" />
                <span className="text-5xl font-bold ml-2">{Math.round(current.temp)}°C</span>
              </div>
              <span className="text-xl capitalize mt-1">{current.weather.description}</span>
              <span className="text-muted-foreground">Feels like {Math.round(current.feels_like)}°C</span>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-muted/50 rounded-lg p-3 flex flex-col items-center justify-center">
              <div className="flex items-center text-muted-foreground mb-1">
                <Thermometer className="h-4 w-4 mr-1" />
                <span>Humidity</span>
              </div>
              <span className="text-2xl font-semibold">{current.humidity}%</span>
            </div>
            
            <div className="bg-muted/50 rounded-lg p-3 flex flex-col items-center justify-center">
              <div className="flex items-center text-muted-foreground mb-1">
                <Wind className="h-4 w-4 mr-1" />
                <span>Wind</span>
              </div>
              <span className="text-2xl font-semibold">{Math.round(current.wind_speed * 3.6)} km/h</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}