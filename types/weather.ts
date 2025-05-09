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
  forecast: ForecastDay[];
  cached?: boolean;
  cachedAt?: string;
}

export interface ForecastDay {
  dt: number;
  temp: {
    min: number;
    max: number;
  };
  weather: {
    id: number;
    main: string;
    description: string;
    icon: string;
  };
}

export interface LocationSearchResult {
  name: string;
  country: string;
  lat: number;
  lon: number;
  state?: string;
}