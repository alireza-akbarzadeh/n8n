# Rate Limiting Error Fix

## Problem Summary

The application was experiencing "worker has exited" errors when trying to use Upstash Redis for rate limiting. This was causing all protected tRPC endpoints to fail with 500 errors.

## Root Causes

1. **Upstash Redis Worker Thread Failures**: The Upstash Redis client uses worker threads that were exiting unexpectedly
2. **No Graceful Degradation**: Rate limiter had no fallback when Redis was unavailable
3. **Aggressive Error Propagation**: Errors from rate limiting were crashing the entire request chain
4. **Multiple Worker Thread Issues**: Both Upstash Redis and Prisma were experiencing worker thread failures

## Implemented Fixes

### 1. Enhanced Error Handling in `lib/rate-limit.ts`

#### Added Retry Configuration to Redis Client

```typescript
redis = new Redis({
  url: env.UPSTASH_REDIS_REST_URL,
  token: env.UPSTASH_REDIS_REST_TOKEN,
  retry: {
    retries: 2,
    backoff: (retryCount) => Math.min(retryCount * 50, 500),
  },
});
```

#### Implemented Circuit Breaker Pattern

```typescript
let redisFailureCount = 0;
const MAX_FAILURES_BEFORE_DISABLE = 3;

function shouldAttemptRateLimit(): boolean {
  if (redisFailureCount >= MAX_FAILURES_BEFORE_DISABLE) {
    logger.warn(
      { failures: redisFailureCount },
      'Rate limiting disabled due to repeated Redis failures'
    );
    return false;
  }
  return true;
}
```

#### Improved Error Handling in `checkRateLimit()`

- Catches all errors during rate limit checks
- Increments failure counter on errors
- Returns safe defaults (allow request) on failures
- Resets failure counter on success
- Logs detailed error information

#### Try-Catch Blocks Added

- Redis client initialization wrapped in try-catch
- Rate limiter instantiation wrapped in try-catch
- Custom rate limiter creation wrapped in try-catch

### 2. Protected tRPC Context in `trpc/init.ts`

Added comprehensive error handling around rate limit checks:

```typescript
let rateLimitResult;
try {
  rateLimitResult = await checkRateLimit(userId);
} catch (error) {
  // If rate limit check completely fails, log and allow request
  logger.error(
    {
      requestId: ctx.requestId,
      userId,
      error: error instanceof Error ? error.message : String(error),
    },
    'Rate limit check failed critically, allowing request'
  );
  rateLimitResult = {
    success: true,
    limit: 10,
    remaining: 10,
    reset: Date.now() + 10000,
  };
}
```

### 3. Environment Variable to Disable Rate Limiting

Added `RATE_LIMIT_ENABLED` environment variable for complete control:

```bash
# Temporarily disable rate limiting
RATE_LIMIT_ENABLED=false
```

## Current Status

**Rate limiting is currently DISABLED** via `RATE_LIMIT_ENABLED=false` to allow the application to function while Redis issues are resolved.

## How to Re-enable Rate Limiting

### Step 1: Verify Upstash Redis Connection

Test your Redis connection:

```bash
# Using redis-cli or Upstash Console
curl https://your-redis-url.upstash.io/ping \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Step 2: Check Configuration

Ensure your `.env` file has correct Upstash credentials:

```bash
UPSTASH_REDIS_REST_URL="https://your-redis-url.upstash.io"
UPSTASH_REDIS_REST_TOKEN="your_token_here"
```

**Important**: Make sure there are no line breaks in the URLs!

### Step 3: Enable Rate Limiting

Remove or change the environment variable:

```bash
# Option 1: Remove the line from .env
# Option 2: Set to true
RATE_LIMIT_ENABLED=true
```

### Step 4: Restart Application

```bash
pnpm dev
```

### Step 5: Monitor Logs

Watch for rate limit messages:

```bash
# Should see these on success:
"Rate limiter initialized"
"Rate limit check passed"

# Should NOT see:
"Rate limiting disabled"
"Rate limit check failed"
```

## Graceful Degradation Behavior

Even with rate limiting enabled, the system now has multiple layers of protection:

1. **Redis Unavailable**: Returns null limiter, allows all requests
2. **Connection Errors**: Caught and logged, allows request
3. **Worker Thread Exits**: Caught and logged, allows request
4. **Circuit Breaker**: After 3 failures, stops attempting rate limiting
5. **tRPC Level Catch**: Final safety net in case anything slips through

## Testing Rate Limiting

Once re-enabled, test with:

```bash
# Make 11 requests in quick succession (should trigger rate limit)
for i in {1..11}; do
  curl http://localhost:3000/api/trpc/workflows.getMany
done
```

Expected behavior:

- First 10 requests: Success (200)
- 11th request: Rate limited (429)

## Configuration Options

Adjust rate limiting settings in `.env`:

```bash
# Maximum requests per window
API_RATE_LIMIT_MAX=10

# Time window (s=seconds, m=minutes, h=hours)
API_RATE_LIMIT_WINDOW=10s
```

## Troubleshooting

### "Worker has exited" errors persist

This indicates a deeper Node.js worker thread issue. Try:

1. Update Node.js to latest LTS
2. Clear `.next` cache: `rm -rf .next`
3. Reinstall dependencies: `rm -rf node_modules pnpm-lock.yaml && pnpm install`
4. Check for conflicting Node.js versions

### Redis connection times out

Check:

- Upstash Redis dashboard for service status
- Network/firewall settings
- Correct region (some regions may have connectivity issues)

### Rate limiting too aggressive

Adjust settings:

```bash
API_RATE_LIMIT_MAX=50  # More requests
API_RATE_LIMIT_WINDOW=1m  # Longer window
```

## Future Improvements

1. **Add Redis Health Check**: Periodic ping to check Redis availability
2. **Metrics Dashboard**: Track rate limit hits, failures, circuit breaker trips
3. **Per-Endpoint Limits**: Different limits for different operation types
4. **User Tier-Based Limits**: Premium users get higher limits
5. **Distributed Rate Limiting**: Use Redis pub/sub for multi-instance coordination

## Related Files

- `lib/rate-limit.ts` - Core rate limiting logic
- `trpc/init.ts` - tRPC context with rate limit integration
- `lib/env.ts` - Environment variable configuration
- `.env` - Environment variables (not in git)

## References

- [Upstash Redis Docs](https://upstash.com/docs/redis)
- [@upstash/ratelimit](https://github.com/upstash/ratelimit)
- [tRPC Middleware](https://trpc.io/docs/server/middlewares)
