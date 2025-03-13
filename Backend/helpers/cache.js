import Redis from 'ioredis';

const redis = new Redis(); // Connects to Redis at localhost:6379 by default

export const setCache = async (key, value, expiration = 3600) => {
  await redis.setex(key, expiration, JSON.stringify(value));
};

export const getCache = async (key) => {
  const cachedData = await redis.get(key);
  return cachedData ? JSON.parse(cachedData) : null;
};

export const clearCache = async (pattern) => {
  try {
    console.log(`Clearing cache for pattern: ${pattern}`);
    const keys = await redis.keys(pattern);
    console.log(`Keys found: ${keys}`);

    if (keys.length > 0) {
      await redis.del(keys);
      console.log(`Deleted keys: ${keys}`);
    }
  } catch (error) {
    console.error('Error clearing cache:', error);
  }
};
