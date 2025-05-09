"use client";

import { 
  Sun, 
  Cloud, 
  CloudRain, 
  CloudSnow, 
  CloudLightning, 
  CloudFog, 
  Droplets
} from "lucide-react";

interface WeatherIconProps {
  iconCode: string;
  className?: string;
}

export function WeatherIcon({ iconCode, className = "h-6 w-6" }: WeatherIconProps) {
  // Map OpenWeather icon codes to Lucide icons
  const getIconComponent = () => {
    // First two characters of the icon code represent the weather condition
    const condition = iconCode.substring(0, 2);
    
    switch (condition) {
      case "01": // clear sky
        return <Sun className={`${className} text-amber-500`} />;
      case "02": // few clouds
      case "03": // scattered clouds
      case "04": // broken clouds
        return <Cloud className={`${className} text-slate-400`} />;
      case "09": // shower rain
      case "10": // rain
        return <CloudRain className={`${className} text-blue-400`} />;
      case "11": // thunderstorm
        return <CloudLightning className={`${className} text-purple-500`} />;
      case "13": // snow
        return <CloudSnow className={`${className} text-slate-300`} />;
      case "50": // mist
        return <CloudFog className={`${className} text-slate-400`} />;
      default:
        return <Droplets className={`${className} text-blue-400`} />;
    }
  };
  
  return getIconComponent();
}