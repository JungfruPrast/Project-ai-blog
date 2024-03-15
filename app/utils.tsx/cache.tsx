const cache = new Map<string, { promise: Promise<any> }>();

export function fetchDataWithLock(key: string, fetchFunction: () => Promise<any>): Promise<any> {
  let cacheItem = cache.get(key);

  if (cacheItem) {
    // If a promise already exists in the cache, wait for it
    return cacheItem.promise;
  } else {
    // No promise in the cache, fetch new data
    let promise = fetchFunction().then(data => {
      cache.delete(key); // Remove the promise from the cache once data is fetched
      return data;
    }).catch(err => {
      cache.delete(key); // On failure, also remove the promise from the cache
      throw err; // Re-throw the error
    });

    // Store the promise in the cache before the data is actually fetched
    cache.set(key, { promise });
    return promise;
  }
}
