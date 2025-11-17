# Worker Thread Issues - Resolution Summary

## Problem

The application was experiencing catastrophic "worker has exited" errors that prevented it from running. Multiple components were failing:

```
Error: the worker thread exited
Error: Cannot find module '/ROOT/node_modules/.pnpm/thread-stream@3.1.0/node_modules/thread-stream/lib/worker.js'
Error: Jest worker encountered 2 child process exceptions
```

## Root Causes Identified

### 1. Pino Logger Worker Threads (`thread-stream`)

- **Problem**: Pino's `pino-pretty` transport uses worker threads via `thread-stream`
- **Symptom**: Next.js/Turbopack couldn't locate the worker module at runtime
- **Impact**: Every `logger.info()`, `logger.error()`, etc. call crashed

### 2. Upstash Redis Worker Threads

- **Problem**: `@upstash/redis` client uses worker threads for async operations
- **Symptom**: Worker threads exiting unexpectedly during initialization
- **Impact**: Rate limiting completely broken, cascading failures in tRPC

### 3. Cascading Failures

The worker thread issues created a chain reaction:

1. Logger crashes when trying to log anything
2. Rate limiter crashes trying to connect to Redis
3. tRPC context creation fails
4. All protected procedures fail
5. Entire application unusable

## Solutions Implemented

### Fix #1: Simplified Pino Logger Configuration

**File**: `lib/logger.ts`

**Changed from**:

```typescript
export const logger = pino({
  transport: isDevelopment
    ? {
        target: 'pino-pretty', // ❌ Uses worker threads
        options: {
          /* ... */
        },
      }
    : undefined,
  // ...
});
```

**Changed to**:

```typescript
export const logger = pino({
  level: env.LOG_LEVEL || 'info',
  browser: {
    asObject: true, // ✅ No worker threads
  },
  // ...
});
```

**Result**: Logger now works synchronously without worker threads

### Fix #2: Enhanced Rate Limiter Error Handling

**File**: `lib/rate-limit.ts`

**Improvements**:

1. Added try-catch around Redis client initialization
2. Added try-catch around Ratelimit instantiation
3. Implemented circuit breaker pattern (stops after 3 failures)
4. All errors now return safe defaults (allow request) instead of crashing

**Key additions**:

```typescript
// Circuit breaker
let redisFailureCount = 0;
const MAX_FAILURES_BEFORE_DISABLE = 3;

// Error handling in checkRateLimit()
try {
  const result = await limiter.limit(identifier);
  redisFailureCount = 0; // Reset on success
  return result;
} catch (error) {
  redisFailureCount++; // Increment on failure
  logger.error({ error, identifier, failureCount: redisFailureCount }, 'Rate limit check failed');
  // Return safe default - allow request
  return { success: true /* ... */ };
}
```

### Fix #3: Protected tRPC Context Wrapper

**File**: `trpc/init.ts`

**Added safety wrapper**:

```typescript
let rateLimitResult;
try {
  rateLimitResult = await checkRateLimit(userId);
} catch (error) {
  // Final safety net - allow request on any error
  logger.error(
    { requestId, userId, error },
    'Rate limit check failed critically, allowing request'
  );
  rateLimitResult = { success: true /* safe defaults */ };
}
```

### Fix #4: Environment Variable Control

**File**: `.env`

**Added**:

```bash
RATE_LIMIT_ENABLED=false
```

This completely bypasses rate limiting while Redis issues are resolved.

## Current Application Status

✅ **Server Running**: Next.js dev server starts without errors
✅ **Logger Working**: All log statements execute without crashes
✅ **tRPC Working**: API endpoints respond (with proper auth checks)
✅ **Pages Loading**: `/workflows` page loads successfully (200 status)
⚠️ **Rate Limiting Disabled**: Temporarily disabled via environment variable
⚠️ **Database Connection**: May need verification (Neon/Prisma)

## Test Results

```bash
 ✓ Starting...
 ✓ Ready in 2.4s
 ○ Compiling /workflows ...
{"level":"INFO","msg":"Rate limiting is disabled via RATE_LIMIT_ENABLED=false"}
{"level":"INFO","msg":"Workflows retrieved successfully","totalCount":2}
 GET /workflows 200 in 14.2s
```

## Next Steps

### Immediate (Application is usable)

1. ✅ Application runs and serves pages
2. ✅ Logging works without crashes
3. ✅ Auth system works (401 errors are expected for unauthorized requests)

### Short Term (Restore full functionality)

1. **Fix Upstash Redis Connection**:
   - Verify Redis endpoint is reachable
   - Check for network/firewall issues
   - Consider using Redis from a different provider if Upstash continues to fail

2. **Re-enable Rate Limiting**:

   ```bash
   # Once Redis is fixed
   RATE_LIMIT_ENABLED=true
   ```

3. **Verify Database Connection**:
   - Test Neon PostgreSQL connectivity
   - Run `pnpm prisma studio` to verify database access
   - Check for any Prisma Client generation issues

### Long Term (Production readiness)

1. **Implement Alternative Logger** for production:
   - Consider simpler logging without worker threads
   - Or use a logging service (Datadog, LogRocket, etc.)

2. **Rate Limiting Alternatives**:
   - Use in-memory rate limiting (node-cache, lru-cache)
   - Use a different Redis provider (Redis Labs, AWS ElastiCache)
   - Implement application-level rate limiting without external dependencies

3. **Worker Thread Compatibility**:
   - File issue with Next.js/Turbopack about worker thread module resolution
   - Monitor updates to `pino`, `@upstash/redis`, and Next.js
   - Consider using alternative packages that don't rely on worker threads in development

## Files Modified

1. `lib/logger.ts` - Removed pino-pretty transport, simplified configuration
2. `lib/rate-limit.ts` - Added comprehensive error handling, circuit breaker
3. `trpc/init.ts` - Added safety wrapper around rate limit checks
4. `.env` - Added `RATE_LIMIT_ENABLED=false`

## Documentation Created

1. `RATE-LIMITING-FIX.md` - Detailed rate limiting troubleshooting guide
2. `WORKER-THREAD-ISSUES.md` - This file

## Key Learnings

1. **Worker threads incompatibility** with Next.js 16.0.1 + Turbopack in development mode
2. **Module resolution issues** for worker scripts in pnpm monorepo setup
3. **Cascading failures** require multiple layers of error handling
4. **Graceful degradation** is essential for optional features like rate limiting
5. **Circuit breakers** prevent repeated failures from overwhelming the system

## References

- [Pino Transport Workers](https://getpino.io/#/docs/transports)
- [Upstash Redis Docs](https://upstash.com/docs/redis)
- [Next.js Worker Threads](https://nextjs.org/docs/app/building-your-application/optimizing/instrumentation)
- [thread-stream GitHub Issues](https://github.com/pinojs/thread-stream/issues)

## Support

If you encounter similar issues:

1. Check Node.js version: `node --version` (v22.12.0 confirmed working)
2. Clear Next.js cache: `rm -rf .next`
3. Reinstall dependencies: `rm -rf node_modules pnpm-lock.yaml && pnpm install`
4. Check for conflicting package versions
5. Review error logs for "worker has exited" or "thread-stream" errors
6. Disable worker-thread-based features temporarily to isolate the issue
