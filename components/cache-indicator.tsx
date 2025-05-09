"use client";

import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { DatabaseIcon, CloudIcon } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface CacheIndicatorProps {
  cached?: boolean;
  cachedAt?: string;
}

export function CacheIndicator({ cached, cachedAt }: CacheIndicatorProps) {
  const [timeAgo, setTimeAgo] = useState<string>("");
  
  useEffect(() => {
    if (cached && cachedAt) {
      setTimeAgo(formatDistanceToNow(new Date(cachedAt), { addSuffix: true }));
      
      // Update the time every minute
      const intervalId = setInterval(() => {
        setTimeAgo(formatDistanceToNow(new Date(cachedAt), { addSuffix: true }));
      }, 60000);
      
      return () => clearInterval(intervalId);
    }
  }, [cached, cachedAt]);
  
  if (!cached) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Badge variant="outline" className="ml-2 bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950 dark:text-blue-300 dark:border-blue-800">
              <CloudIcon className="h-3 w-3 mr-1" />
              Fresh
            </Badge>
          </TooltipTrigger>
          <TooltipContent>
            <p>Data loaded directly from OpenWeather API</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }
  
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Badge variant="outline" className="ml-2 bg-green-50 text-green-700 border-green-200 dark:bg-green-950 dark:text-green-300 dark:border-green-800">
            <DatabaseIcon className="h-3 w-3 mr-1" />
            Cached
          </Badge>
        </TooltipTrigger>
        <TooltipContent>
          <p>Data loaded from Redis cache {timeAgo}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}