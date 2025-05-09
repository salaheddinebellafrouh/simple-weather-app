"use client";

import { useState } from 'react';
import { WeatherData } from '@/lib/weather-service';
import { WeatherDisplay } from './weather-display';
import { LocationSearch } from './location-search';
import { RedisToggle } from './redis-toggle';
import { Button } from "@/components/ui/button";
import { RefreshCw, DatabaseZap } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface WeatherContainerProps {
  initialWeatherData: WeatherData | null;
}

export function WeatherContainer({ initialWeatherData }: WeatherContainerProps) {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(initialWeatherData);
  const [loading, setLoading] = useState(false);
  const [redisEnabled, setRedisEnabled] = useState(true);
  const { toast } = useToast();

  const handleLocationSelect = async (lat: number, lon: number) => {
    setLoading(true);
    try {
      console.log('Fetching weather for:', { lat, lon });
      const response = await fetch(`/api/weather?lat=${lat}&lon=${lon}`);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Failed to parse error response' }));
        console.error('Weather API error:', {
          status: response.status,
          statusText: response.statusText,
          error: errorData
        });
        throw new Error(errorData.error || 'Failed to fetch weather data');
      }

      const data = await response.json().catch(error => {
        console.error('Error parsing weather response:', error);
        throw new Error('Invalid weather data received');
      });

      if (!data || !data.location || !data.current) {
        console.error('Invalid weather data format:', data);
        throw new Error('Invalid weather data format');
      }

      console.log('Weather data received:', {
        location: data.location.name,
        country: data.location.country,
        currentTemp: data.current.temp
      });

      setWeatherData(data);
      toast({
        title: "Weather Updated",
        description: `Successfully fetched weather data for ${data.location.name}`,
      });
    } catch (error) {
      console.error('Error fetching weather:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : 'Failed to fetch weather data. Please try again.',
      });
      // Keep the previous weather data if available
      if (!weatherData) {
        setWeatherData(null);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    if (weatherData) {
      handleLocationSelect(weatherData.location.lat, weatherData.location.lon);
    }
  };

  const handleClearCache = async () => {
    try {
      const response = await fetch("/api/cache/clear", {
        method: "POST",
      });
      
      if (!response.ok) {
        throw new Error("Failed to clear cache");
      }
      
      const result = await response.json();
      
      toast({
        title: "Cache Cleared",
        description: `Cleared ${result.cleared || 0} cached weather entries`,
        variant: "default",
      });
      
      // Refresh current weather data if available
      if (weatherData) {
        handleRefresh();
      }
    } catch (error) {
      console.error("Error clearing cache:", error);
      toast({
        title: "Error",
        description: "Failed to clear cache",
        variant: "destructive",
      });
    }
  };

  const handleRedisToggle = (enabled: boolean) => {
    setRedisEnabled(enabled);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <LocationSearch onLocationSelect={handleLocationSelect} />
        
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={loading || !weatherData}
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={handleClearCache}
            disabled={loading}
          >
            <DatabaseZap className="h-4 w-4 mr-2" />
            Clear Cache
          </Button>
        </div>
      </div>
      
      <RedisToggle isEnabled={redisEnabled} onToggle={handleRedisToggle} />
      
      <WeatherDisplay data={weatherData} isLoading={loading} />
    </div>
  );
}