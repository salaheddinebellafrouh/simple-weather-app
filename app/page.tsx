import { getDefaultWeatherData } from "@/lib/weather-service";
import { WeatherContainer } from "@/components/weather-container";

export default async function Home() {
  // Fetch initial weather data server-side
  const initialWeatherData = await getDefaultWeatherData();

  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-10">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
            Weather Forecast
          </h1>
          <p className="text-muted-foreground">
            Powered by OpenWeather API with Redis caching for optimal performance
          </p>
        </header>
        
        <WeatherContainer initialWeatherData={initialWeatherData} />
        
        <footer className="mt-16 text-center text-sm text-muted-foreground">
          <p>
            This application demonstrates server-side rendering with efficient Redis caching.
          </p>
          <p className="mt-1">
            Weather data is cached for 30 minutes, while location data is cached for 24 hours.
          </p>
        </footer>
      </div>
    </main>
  );
}