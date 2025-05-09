"use client";

import { Database } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface RedisToggleProps {
  isEnabled: boolean;
  onToggle: (enabled: boolean) => void;
}

export function RedisToggle({ isEnabled, onToggle }: RedisToggleProps) {
  const { toast } = useToast();

  const toggleRedis = async () => {
    try {
      const response = await fetch('/api/cache/toggle', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ enabled: !isEnabled }),
      });

      if (!response.ok) {
        throw new Error('Failed to toggle Redis');
      }

      const data = await response.json();
      onToggle(data.enabled);
      
      toast({
        title: "Redis Cache " + (data.enabled ? "Enabled" : "Disabled"),
        description: data.enabled ? "Using Redis for caching" : "Caching disabled",
      });
    } catch (error) {
      console.error('Error toggling Redis:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to toggle Redis cache",
      });
    }
  };

  return (
    <div className="flex items-center justify-between p-4 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-lg shadow-lg">
      <div className="flex items-center space-x-3">
        <div className="p-2 bg-indigo-100 dark:bg-indigo-900/50 rounded-lg">
          <Database className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
        </div>
        <Label htmlFor="redis-mode" className="text-gray-800 dark:text-gray-200 font-medium">
          Redis Cache
        </Label>
      </div>
      <Switch
        id="redis-mode"
        checked={isEnabled}
        onCheckedChange={toggleRedis}
        className="data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-indigo-500 data-[state=checked]:to-purple-500"
      />
    </div>
  );
} 