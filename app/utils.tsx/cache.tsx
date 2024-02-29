// Extending the CacheItem type to include a promise for the data being fetched
interface CacheItem {
  data: any;
  timestamp: number;
  promise?: Promise<any>; // A promise that resolves to the data
}

const cache = new Map<string, CacheItem>();

export function setCache(key: string, data: any, ttl: number = 3600): void {
  console.log(`[Cache] Setting data for key: "${key}" with TTL: ${ttl} seconds.`);
  cache.set(key, { data, timestamp: Date.now() + ttl * 1000 });
}

export function getCache(key: string): any | null {
  const item = cache.get(key);
  if (item) {
    if (Date.now() < item.timestamp) {
      console.log(`[Cache] Hit for key: "${key}"`);
      return item.data;
    } else {
      console.log(`[Cache] Miss or expired item for key: "${key}". Removing from cache.`);
      cache.delete(key); // Clean up expired item
    }
  }
  return null;
}

// Function to handle fetching data with locking mechanism //not in use lol
export function fetchDataWithLock(key: string, fetchFunction: () => Promise<any>, ttl: number = 3600): Promise<any> {
  let item = cache.get(key);
  if (item && item.promise) { // If there's a promise in the cache, wait for it
    return item.promise;
  } else if (item && Date.now() < item.timestamp) { // If data is in the cache and valid, return it
    return Promise.resolve(item.data);
  } else { // No valid data or promise in the cache, fetch new data
    let promise = fetchFunction().then(data => {
      setCache(key, data, ttl); // Cache the new data
      return data;
    }).catch(err => {
      cache.delete(key); // On failure, remove the failed promise from the cache
      throw err; // Re-throw the error
    });

    // Store the promise in the cache before the data is actually fetched
    cache.set(key, { data: null, timestamp: Date.now() + ttl * 1000, promise });
    return promise;
  }
}
