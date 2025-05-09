'use client';

import { WeatherData } from '@/lib/weather-service';
import { Card } from '@/components/ui/card';
import { Cloud, Sun, CloudRain, Wind, Thermometer, Droplets } from 'lucide-react';

interface WeatherDisplayProps {
  data: WeatherData | null;
  isLoading?: boolean;
}

export function WeatherDisplay({ data, isLoading }: WeatherDisplayProps) {
  if (isLoading) {
    return (
      <div className="animate-pulse space-y-6">
        <div className="h-48 bg-gray-200 dark:bg-gray-800 rounded-xl"></div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-24 bg-gray-200 dark:bg-gray-800 rounded-xl"></div>
          ))}
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <Card className="p-8 text-center bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-none shadow-lg">
        <p className="text-gray-500 dark:text-gray-400 text-lg">Select a location to view weather information</p>
      </Card>
    );
  }

  const getWeatherIcon = (condition: string) => {
    const lowerCondition = condition.toLowerCase();
    if (lowerCondition.includes('rain')) return <CloudRain className="w-10 h-10 text-blue-500 dark:text-blue-400" />;
    if (lowerCondition.includes('cloud')) return <Cloud className="w-10 h-10 text-gray-500 dark:text-gray-400" />;
    return <Sun className="w-10 h-10 text-amber-500 dark:text-amber-400" />;
  };

  return (
    <div className="space-y-6">
      <Card className="p-8 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 dark:from-indigo-600 dark:via-purple-600 dark:to-pink-600 text-white shadow-xl border-none">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">{data.location.name}</h2>
            <p className="text-indigo-100 dark:text-indigo-200 mt-1">{data.location.country}</p>
          </div>
          <div className="text-5xl font-bold">
            {Math.round(data.current.temp)}°
          </div>
        </div>
        <div className="mt-6 flex items-center space-x-3">
          {getWeatherIcon(data.current.weather.main)}
          <span className="text-xl capitalize">{data.current.weather.main}</span>
        </div>
      </Card>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-6 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border-none shadow-lg hover:shadow-xl transition-shadow">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-indigo-100 dark:bg-indigo-900/50 rounded-lg">
              <Thermometer className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Feels Like</p>
              <p className="text-xl font-semibold text-gray-800 dark:text-gray-200">{Math.round(data.current.feels_like)}°</p>
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border-none shadow-lg hover:shadow-xl transition-shadow">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-indigo-100 dark:bg-indigo-900/50 rounded-lg">
              <Wind className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Wind</p>
              <p className="text-xl font-semibold text-gray-800 dark:text-gray-200">{data.current.wind_speed} m/s</p>
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border-none shadow-lg hover:shadow-xl transition-shadow">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-indigo-100 dark:bg-indigo-900/50 rounded-lg">
              <Droplets className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Humidity</p>
              <p className="text-xl font-semibold text-gray-800 dark:text-gray-200">{data.current.humidity}%</p>
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border-none shadow-lg hover:shadow-xl transition-shadow">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-indigo-100 dark:bg-indigo-900/50 rounded-lg">
              <Droplets className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Humidity</p>
              <p className="text-xl font-semibold text-gray-800 dark:text-gray-200">{data.current.humidity}%</p>
            </div>
          </div>
        </Card>
      </div>

      <Card className="p-8 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border-none shadow-lg">
        <h3 className="text-xl font-semibold mb-6 text-gray-800 dark:text-gray-200">5-Day Forecast</h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
          {data.forecast.slice(1, 6).map((day, index) => (
            <div key={index} className="text-center p-4 bg-white/80 dark:bg-gray-700/80 rounded-xl hover:shadow-md transition-shadow">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
                {new Date(day.dt * 1000).toLocaleDateString('en-US', { weekday: 'short' })}
              </p>
              <div className="my-3">
                {getWeatherIcon(day.weather.main)}
              </div>
              <div className="flex flex-col items-center">
                <p className="text-xl font-semibold text-gray-800 dark:text-gray-200">{Math.round(day.temp.max)}°</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">{Math.round(day.temp.min)}°</p>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 capitalize mt-1">{day.weather.main}</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
} 