import type { AppConfig } from './config';
import { ApiError } from './http-errors';

interface Bucket {
  count: number;
  resetAt: number;
}

export interface RateLimiter {
  enforceLimit: (
    identifier: string,
    limit: number,
    windowSeconds: number,
  ) => Promise<void>;
}

export function createRateLimiter(
  config: AppConfig,
  now: () => number = Date.now,
): RateLimiter {
  const memoryBuckets = new Map<string, Bucket>();

  const enforceMemory = async (
    identifier: string,
    limit: number,
    windowSeconds: number,
  ): Promise<void> => {
    const currentTime = now();
    const existing = memoryBuckets.get(identifier);
    const bucket =
      !existing || existing.resetAt <= currentTime
        ? { count: 0, resetAt: currentTime + windowSeconds * 1000 }
        : existing;
    bucket.count += 1;
    memoryBuckets.set(identifier, bucket);
    if (bucket.count > limit) {
      throw new ApiError(
        429,
        'RATE_LIMITED',
        'Muitas solicitações. Tente novamente mais tarde.',
        Math.max(1, Math.ceil((bucket.resetAt - currentTime) / 1000)),
      );
    }
  };

  return {
    async enforceLimit(identifier, limit, windowSeconds) {
      await enforceMemory(identifier, limit, windowSeconds);
    },
  };
}
