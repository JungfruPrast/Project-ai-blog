interface CacheItem {
  data: any; // Consider using a more specific type based on what you're caching
  timestamp: number;
}

const cache = new Map<string, CacheItem>();

export function setCache(key: string, data: any, ttl: number = 3600): void {
  console.log(`[Cache] Setting data for key: "${key}" with TTL: ${ttl} seconds.`);
  cache.set(key, { data, timestamp: Date.now() + ttl * 1000 });
}

export function getCache(key: string): any | null {
  const item = cache.get(key);
  if (item && Date.now() < item.timestamp) {
    console.log(`[Cache] Hit for key: "${key}"`);
    return item.data;
  }

  // This log will indicate both a cache miss and when an item is being removed because it's expired.
  console.log(`[Cache] Miss or expired item for key: "${key}". Removing from cache.`);
  cache.delete(key); // Clean up expired item
  return null;
}
