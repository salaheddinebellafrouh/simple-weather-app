import { Redis } from 'ioredis';
import { isRedisEnabled } from './redis-state';

// Initialize Redis client with a mock implementation
let redis: Redis = {
  get: async () => null,
  set: async () => 'OK',
  keys: async () => [],
  del: async () => 0,
  on: () => {},
} as unknown as Redis;

// Initialize real Redis client if available
try {
  const realRedis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');
  realRedis.on('connect', () => console.log('Redis connected successfully'));
  realRedis.on('error', (error) => console.error('Redis connection error:', error));
  redis = realRedis;
} catch (error) {
  console.error('Failed to initialize Redis:', error);
}

// Cache TTLs in seconds
export const CACHE_TTL = {
  WEATHER: 1800, // 30 minutes
  LOCATION: 86400, // 24 hours
};

// Cache keys
export const CACHE_KEYS = {
  WEATHER: (lat: number, lon: number) => `weather:${lat}:${lon}`,
  LOCATION: (query: string) => `location:${query}`,
};

// Get cached data
export async function getCachedData<T>(key: string): Promise<T | null> {
  if (!isRedisEnabled()) {
    console.log('Redis disabled, skipping cache read');
    return null;
  }

  try {
    const data = await redis.get(key);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Redis get error:', error);
    return null;
  }
}

// Set cached data
export async function setCachedData<T>(key: string, data: T, ttl: number): Promise<void> {
  if (!isRedisEnabled()) {
    console.log('Redis disabled, skipping cache write');
    return;
  }

  try {
    await redis.set(key, JSON.stringify(data), 'EX', ttl);
  } catch (error) {
    console.error('Redis set error:', error);
  }
}

// Clear all weather cache
export async function clearAllWeatherCache(): Promise<{ cleared: number }> {
  if (!isRedisEnabled()) {
    console.log('Redis disabled, skipping cache clear');
    return { cleared: 0 };
  }

  try {
    const keys = await redis.keys('weather:*');
    if (keys.length > 0) {
      await redis.del(...keys);
    }
    return { cleared: keys.length };
  } catch (error) {
    console.error('Redis clear error:', error);
    return { cleared: 0 };
  }
}

// Clear all location cache
export async function clearAllLocationCache(): Promise<{ cleared: number }> {
  try {
    const keys = await redis.keys('location:*');
    if (keys.length > 0) {
      await redis.del(...keys);
    }
    return { cleared: keys.length };
  } catch (error) {
    console.error('Redis clear error:', error);
    return { cleared: 0 };
  }
}

export default redis;