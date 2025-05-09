"use client";

import { Button } from "@/components/ui/button";
import { MapPin } from "lucide-react";

interface Location {
  name: string;
  lat: number;
  lon: number;
}

const locations: Location[] = [
  { name: "London", lat: 51.5074, lon: -0.1278 },
  { name: "New York", lat: 40.7128, lon: -74.0060 },
  { name: "Tokyo", lat: 35.6762, lon: 139.6503 },
  { name: "Sydney", lat: -33.8688, lon: 151.2093 },
  { name: "Dubai", lat: 25.2048, lon: 55.2708 },
];

interface LocationSearchProps {
  onLocationSelect: (lat: number, lon: number) => void;
  selectedLocation?: string;
}

export function LocationSearch({ onLocationSelect, selectedLocation }: LocationSearchProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3 text-gray-800 dark:text-gray-200">
        <div className="p-2 bg-indigo-100 dark:bg-indigo-900/50 rounded-lg">
          <MapPin className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
        </div>
        <h2 className="text-xl font-semibold">Select Location</h2>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {locations.map((location) => (
          <Button
            key={location.name}
            variant={selectedLocation === location.name ? "default" : "outline"}
            className={`h-16 text-lg font-medium transition-all duration-200
              ${selectedLocation === location.name 
                ? 'bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white' 
                : 'bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm hover:bg-white dark:hover:bg-gray-700 hover:shadow-md text-gray-800 dark:text-gray-200'
              }`}
            onClick={() => onLocationSelect(location.lat, location.lon)}
          >
            {location.name}
          </Button>
        ))}
      </div>
    </div>
  );
}