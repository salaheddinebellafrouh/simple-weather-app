// Global variable to track Redis state
let redisEnabled = true;

export function isRedisEnabled() {
  return redisEnabled;
}

export function setRedisEnabled(enabled: boolean) {
  redisEnabled = enabled;
} 