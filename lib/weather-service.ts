import { CACHE_KEYS, CACHE_TTL, getCachedData, setCachedData } from './redis';

const GEO_URL = 'https://geocoding-api.open-meteo.com/v1';
const WEATHER_URL = 'https://api.open-meteo.com/v1';

export interface WeatherData {
  location: {
    name: string;
    country: string;
    lat: number;
    lon: number;
  };
  current: {
    temp: number;
    feels_like: number;
    humidity: number;
    wind_speed: number;
    wind_direction: number;
    weather: {
      id: number;
      main: string;
      description: string;
      icon: string;
    };
    dt: number;
  };
  forecast: Array<{
    dt: number;
    temp: {
      min: number;
      max: number;
      day: number;
    };
    weather: {
      id: number;
      main: string;
      description: string;
      icon: string;
    };
  }>;
}

export interface LocationData {
  name: string;
  country: string;
  lat: number;
  lon: number;
  state?: string;
}

// Helper functions to convert WMO weather codes to OpenWeather-like format
function getWeatherCode(code: number): number {
  return code;
}

function getWeatherMain(code: number): string {
  switch (true) {
    case code === 0:
      return 'Clear';
    case code === 1:
      return 'Clear';
    case code === 2:
      return 'Clouds';
    case code === 3:
      return 'Clouds';
    case code >= 45 && code <= 48:
      return 'Fog';
    case code >= 51 && code <= 55:
      return 'Drizzle';
    case code >= 61 && code <= 65:
      return 'Rain';
    case code >= 71 && code <= 77:
      return 'Snow';
    case code >= 80 && code <= 82:
      return 'Rain';
    case code >= 85 && code <= 86:
      return 'Snow';
    case code >= 95:
      return 'Thunderstorm';
    default:
      return 'Clear';
  }
}

function getWeatherDescription(code: number): string {
  switch (true) {
    case code === 0:
      return 'clear sky';
    case code === 1:
      return 'mainly clear';
    case code === 2:
      return 'partly cloudy';
    case code === 3:
      return 'overcast';
    case code >= 45 && code <= 48:
      return 'foggy';
    case code >= 51 && code <= 55:
      return 'drizzle';
    case code >= 61 && code <= 65:
      return 'rain';
    case code >= 71 && code <= 77:
      return 'snow';
    case code >= 80 && code <= 82:
      return 'rain showers';
    case code >= 85 && code <= 86:
      return 'snow showers';
    case code >= 95:
      return 'thunderstorm';
    default:
      return 'clear sky';
  }
}

function getWeatherIcon(code: number): string {
  switch (true) {
    case code === 0:
      return '01d';
    case code === 1:
      return '02d';
    case code === 2:
      return '03d';
    case code === 3:
      return '04d';
    case code >= 45 && code <= 48:
      return '50d';
    case code >= 51 && code <= 55:
      return '09d';
    case code >= 61 && code <= 65:
      return '10d';
    case code >= 71 && code <= 77:
      return '13d';
    case code >= 80 && code <= 82:
      return '09d';
    case code >= 85 && code <= 86:
      return '13d';
    case code >= 95:
      return '11d';
    default:
      return '01d';
  }
}

// Format API response into our application's data model
function formatWeatherData(weather: any, location: any): WeatherData {
  return {
    location: {
      name: location.name,
      country: location.country,
      lat: location.lat,
      lon: location.lon,
    },
    current: {
      temp: weather.current.temperature_2m,
      feels_like: weather.current.apparent_temperature,
      humidity: weather.current.relative_humidity_2m,
      wind_speed: weather.current.wind_speed_10m,
      wind_direction: weather.current.wind_direction_10m,
      weather: {
        id: getWeatherCode(weather.current.weather_code),
        main: getWeatherMain(weather.current.weather_code),
        description: getWeatherDescription(weather.current.weather_code),
        icon: getWeatherIcon(weather.current.weather_code),
      },
      dt: Math.floor(new Date(weather.current.time).getTime() / 1000),
    },
    forecast: weather.daily.time.map((time: string, index: number) => ({
      dt: Math.floor(new Date(time).getTime() / 1000),
      temp: {
        min: weather.daily.temperature_2m_min[index],
        max: weather.daily.temperature_2m_max[index],
      },
      weather: {
        id: getWeatherCode(weather.daily.weather_code[index]),
        main: getWeatherMain(weather.daily.weather_code[index]),
        description: getWeatherDescription(weather.daily.weather_code[index]),
        icon: getWeatherIcon(weather.daily.weather_code[index]),
      },
    })),
  };
}

// Get weather data with caching
export async function getWeatherData(lat: number, lon: number): Promise<WeatherData | null> {
  const cacheKey = CACHE_KEYS.WEATHER(lat, lon);
  
  // Try to get from cache first
  const cachedData = await getCachedData<WeatherData>(cacheKey);
  if (cachedData) {
    console.log('Using cached weather data for:', { lat, lon });
    return cachedData;
  }

  console.log('Fetching fresh weather data for:', { lat, lon });

  // If not in cache, fetch from API
  try {
    // First get the weather data
    const weatherUrl = `${WEATHER_URL}/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m,wind_direction_10m&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=auto&forecast_days=7`;
    console.log('Fetching weather from:', weatherUrl);
    
    const weatherResponse = await fetch(weatherUrl);
    
    if (!weatherResponse.ok) {
      console.error('Weather API error:', {
        status: weatherResponse.status,
        statusText: weatherResponse.statusText
      });
      throw new Error('Weather API request failed');
    }

    const weatherData = await weatherResponse.json();
    console.log('Weather data received:', {
      current: weatherData.current ? 'present' : 'missing',
      daily: weatherData.daily ? 'present' : 'missing'
    });

    if (!weatherData.current || !weatherData.daily) {
      throw new Error('Invalid weather data received');
    }
    
    // Get location data from reverse geocoding using Nominatim
    const geoUrl = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=10&addressdetails=1`;
    console.log('Fetching location from:', geoUrl);
    
    const locationResponse = await fetch(geoUrl, {
      headers: {
        'User-Agent': 'WeatherApp/1.0'
      }
    });

    let location = {
      name: `${lat.toFixed(2)}, ${lon.toFixed(2)}`,
      country: 'Unknown',
      lat,
      lon,
    };

    if (locationResponse.ok) {
      const locationData = await locationResponse.json();
      console.log('Location data received:', locationData);
      
      if (locationData) {
        location = {
          name: locationData.address?.city || 
                locationData.address?.town || 
                locationData.address?.village || 
                locationData.address?.suburb || 
                locationData.display_name?.split(',')[0] || 
                `${lat.toFixed(2)}, ${lon.toFixed(2)}`,
          country: locationData.address?.country || 'Unknown',
          lat,
          lon,
        };
        console.log('Location resolved to:', location);
      }
    } else {
      console.warn('Geocoding API failed:', {
        status: locationResponse.status,
        statusText: locationResponse.statusText
      });
    }

    // Format the weather data according to our model
    const formattedData = formatWeatherData(weatherData, location);
    console.log('Formatted weather data:', {
      location: formattedData.location.name,
      country: formattedData.location.country,
      currentTemp: formattedData.current.temp,
      forecastDays: formattedData.forecast.length
    });
    
    // Cache the response
    await setCachedData(cacheKey, formattedData, CACHE_TTL.WEATHER);
    
    return formattedData;
  } catch (error) {
    console.error('Error in getWeatherData:', error);
    return null;
  }
}

// Search locations with caching
export async function searchLocation(query: string): Promise<LocationData[]> {
  const cacheKey = CACHE_KEYS.LOCATION(query);
  
  // Try to get from cache first
  const cachedData = await getCachedData<LocationData[]>(cacheKey);
  if (cachedData) {
    return cachedData;
  }

  // If not in cache, fetch from API
  try {
    const response = await fetch(
      `${GEO_URL}/search?name=${encodeURIComponent(query)}&count=5&language=en&format=json`
    );
    
    if (!response.ok) {
      throw new Error('Location search API request failed');
    }

    const data = await response.json();
    
    if (!data.results) {
      return [];
    }

    const locations = data.results.map((result: any) => ({
      name: result.name,
      country: result.country,
      lat: result.latitude,
      lon: result.longitude,
      state: result.admin1,
    }));

    // Cache the response
    await setCachedData(cacheKey, locations, CACHE_TTL.LOCATION);
    
    return locations;
  } catch (error) {
    console.error('Error searching locations:', error);
    return [];
  }
}

// Get default weather data (for initial page load)
export async function getDefaultWeatherData(): Promise<WeatherData | null> {
  // Default to London coordinates
  return getWeatherData(51.5074, -0.1278);
}