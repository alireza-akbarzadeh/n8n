# tRPC Enhanced Features Guide

This guide shows how to use the enhanced tRPC setup with rate limiting, request tracking, audit logging, and performance monitoring.

## 📋 Table of Contents

- [Features](#features)
- [Quick Start](#quick-start)
- [Request ID Tracking](#request-id-tracking)
- [Rate Limiting](#rate-limiting)
- [Audit Logging](#audit-logging)
- [Performance Monitoring](#performance-monitoring)
- [Error Logging](#error-logging)
- [Advanced Usage](#advanced-usage)

---

## ✨ Features

### Automatic Features (No Code Required)

All protected procedures automatically include:

- ✅ **Request ID tracking** - Unique ID for every request
- ✅ **Rate limiting** - 100 requests per 15 minutes per user (configurable)
- ✅ **Enhanced logging** - Structured logs with context
- ✅ **Error tracking** - Detailed error logs with request context

### Opt-in Features

- 🔒 **Audit logging** - Use `auditMiddleware()` for automatic CRUD tracking
- ⚡ **Performance monitoring** - Automatic slow query detection

---

## 🚀 Quick Start

### 1. Basic Protected Procedure

```typescript
import { createTRPCRouter, protectedProcedure } from '@/trpc/init';
import { z } from 'zod';

export const myRouter = createTRPCRouter({
  // This procedure automatically gets:
  // - Request ID tracking
  // - Rate limiting (100 req/15min)
  // - Error logging
  getData: protectedProcedure.input(z.object({ id: z.string() })).query(({ input, ctx }) => {
    // ctx.requestId - Unique request ID
    // ctx.userId - Authenticated user ID
    // ctx.rateLimit - Rate limit status

    return { id: input.id, userId: ctx.userId };
  }),
});
```

### 2. With Automatic Audit Logging

```typescript
import { auditMiddleware } from '@/trpc/middleware';

export const myRouter = createTRPCRouter({
  createWorkflow: auditMiddleware('CREATE', 'WORKFLOW')
    .input(z.object({ name: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const workflow = await ctx.db.workflow.create({
        data: { name: input.name, userId: ctx.userId! },
      });

      // Return object with 'id' field for automatic audit
      return { id: workflow.id, name: workflow.name };
    }),
});
```

---

## 🔍 Request ID Tracking

Every request gets a unique ID for tracing across logs.

### Accessing Request ID

```typescript
protectedProcedure.query(({ ctx }) => {
  console.log('Request ID:', ctx.requestId);
  // Use in logs, error messages, etc.
});
```

### Finding Requests in Logs

```bash
# All logs include requestId
pnpm logs | grep "abc-123-def"
```

### Client-Side Tracking

Request IDs are included in response headers as `X-Request-Id`:

```typescript
// In your API route or tRPC handler
response.headers.set('X-Request-Id', ctx.requestId);
```

---

## 🚦 Rate Limiting

### Default Configuration

- **Limit**: 100 requests per 15 minutes per user
- **Algorithm**: Sliding window (via Upstash Redis)
- **Scope**: Per authenticated user

### Configuration

Edit `.env.local`:

```env
# Required for rate limiting
UPSTASH_REDIS_REST_URL=https://your-redis.upstash.io
UPSTASH_REDIS_REST_TOKEN=your-token

# Customize limits
API_RATE_LIMIT_MAX=100        # Max requests
API_RATE_LIMIT_WINDOW=15m     # Time window (15m, 1h, etc.)
```

### Checking Rate Limit Status

```typescript
protectedProcedure.query(({ ctx }) => {
  const { remaining, reset, limit } = ctx.rateLimit;

  console.log(`Remaining: ${remaining}/${limit}`);
  console.log(`Resets at: ${new Date(reset)}`);
});
```

### Custom Rate Limits

For specific endpoints requiring different limits:

```typescript
import { checkRateLimit } from '@/lib/rate-limit';

protectedProcedure.mutation(async ({ ctx }) => {
  // Custom limit: 10 requests per minute
  const result = await checkRateLimit(`custom:${ctx.userId}:action`);

  if (!result.success) {
    throw new TRPCError({
      code: 'TOO_MANY_REQUESTS',
      message: 'Custom rate limit exceeded',
    });
  }

  // Your logic here
});
```

### Graceful Degradation

If Redis is unavailable, rate limiting is disabled and requests proceed normally.

---

## 📋 Audit Logging

Automatically log all CRUD operations to the database.

### Supported Actions

- `CREATE` - Creating new entities
- `UPDATE` - Updating existing entities
- `DELETE` - Deleting entities
- `EXECUTE` - Running workflows/executions
- `VIEW` - Viewing sensitive data
- `EXPORT` - Exporting data
- `IMPORT` - Importing data

### Supported Entity Types

- `WORKFLOW` - Workflow operations
- `EXECUTION` - Execution operations
- `CREDENTIAL` - Credential operations
- `WEBHOOK` - Webhook operations
- `USER` - User operations
- `NODE` - Node operations

### Using auditMiddleware

#### 1. Create Operation

```typescript
import { auditMiddleware } from '@/trpc/middleware';

export const workflowRouter = createTRPCRouter({
  create: auditMiddleware('CREATE', 'WORKFLOW')
    .input(z.object({ name: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const workflow = await ctx.db.workflow.create({
        data: { name: input.name, userId: ctx.userId! },
      });

      // IMPORTANT: Return object with 'id' field
      return {
        id: workflow.id, // <-- auditMiddleware picks this up
        name: workflow.name,
      };
    }),
});
```

#### 2. Update Operation

```typescript
update: auditMiddleware('UPDATE', 'WORKFLOW')
  .input(z.object({ id: z.string(), name: z.string() }))
  .mutation(async ({ input, ctx }) => {
    const workflow = await ctx.db.workflow.update({
      where: { id: input.id },
      data: { name: input.name },
    });

    return { id: workflow.id, name: workflow.name };
  }),
```

#### 3. Delete Operation

```typescript
delete: auditMiddleware('DELETE', 'WORKFLOW')
  .input(z.object({ id: z.string() }))
  .mutation(async ({ input, ctx }) => {
    await ctx.db.workflow.delete({ where: { id: input.id } });

    return { id: input.id, deleted: true };
  }),
```

#### 4. Execute Operation

```typescript
execute: auditMiddleware('EXECUTE', 'WORKFLOW')
  .input(z.object({ workflowId: z.string() }))
  .mutation(async ({ input, ctx }) => {
    // Start execution
    const execution = await startWorkflowExecution(input.workflowId);

    return {
      id: input.workflowId,  // Workflow ID for audit
      executionId: execution.id,
    };
  }),
```

### Manual Audit Logging

For more control or complex scenarios:

```typescript
import { createAuditLog } from '@/lib/audit';

protectedProcedure.mutation(async ({ ctx }) => {
  // Your business logic
  const credential = await getCredential(id);

  // Manual audit log with custom metadata
  await createAuditLog({
    action: 'VIEW',
    entityType: 'CREDENTIAL',
    entityId: credential.id,
    userId: ctx.userId,
    credentialId: credential.id,
    metadata: {
      requestId: ctx.requestId,
      credentialType: credential.type,
      accessedFields: ['name', 'type'], // Custom data
    },
  });

  return credential;
});
```

### Querying Audit Logs

```typescript
import { getAuditLogs, getUserAuditLogs } from '@/lib/audit';

// Get logs for a specific entity
const logs = await getAuditLogs('WORKFLOW', workflowId, 50);

// Get logs for a user
const userLogs = await getUserAuditLogs(userId, 100);

// Get recent activity across all entities
const recent = await getRecentAuditActivity(100);
```

---

## ⚡ Performance Monitoring

Automatic slow query detection logs warnings for requests > 1000ms.

### Automatic Monitoring

All procedures are automatically monitored:

```typescript
// Automatically logs if this takes > 1000ms
protectedProcedure.query(async ({ ctx }) => {
  const data = await expensiveOperation();
  return data;
});
```

### Custom Thresholds

```typescript
import { createPerformanceMiddleware } from '@/trpc/middleware';

// Create custom middleware with 500ms threshold
const fastProcedure = protectedProcedure.use(createPerformanceMiddleware(500));

export const myRouter = createTRPCRouter({
  fastEndpoint: fastProcedure.query(async () => {
    // Logs warning if > 500ms
  }),
});
```

### Manual Performance Tracking

```typescript
import { logger, startTimer } from '@/lib/logger';

protectedProcedure.query(async ({ ctx }) => {
  const timer = startTimer();

  // Your operation
  const result = await doWork();

  logger.info(
    {
      requestId: ctx.requestId,
      duration: timer(),
    },
    'Operation completed'
  );

  return result;
});
```

---

## 🔴 Error Logging

All errors are automatically logged with context.

### Automatic Error Logging

```typescript
protectedProcedure.mutation(async ({ ctx }) => {
  // If this throws, it's automatically logged with:
  // - requestId
  // - userId
  // - error details
  // - stack trace
  throw new TRPCError({
    code: 'BAD_REQUEST',
    message: 'Invalid input',
  });
});
```

### Custom Error Logging

```typescript
import { logger } from '@/lib/logger';

protectedProcedure.mutation(async ({ ctx }) => {
  try {
    await riskyOperation();
  } catch (error) {
    logger.error(
      {
        requestId: ctx.requestId,
        userId: ctx.userId,
        operation: 'riskyOperation',
        error,
      },
      'Operation failed'
    );

    throw new TRPCError({
      code: 'INTERNAL_SERVER_ERROR',
      message: 'Operation failed',
    });
  }
});
```

---

## 🎯 Advanced Usage

### Combining Multiple Features

```typescript
import { auditMiddleware } from '@/trpc/middleware';
import { logger } from '@/lib/logger';
import { checkRateLimit } from '@/lib/rate-limit';

export const advancedRouter = createTRPCRouter({
  // Create with audit + custom validation + performance tracking
  createAdvanced: auditMiddleware('CREATE', 'WORKFLOW')
    .input(
      z.object({
        name: z.string(),
        nodes: z.array(z.object({ type: z.string() })),
      })
    )
    .mutation(async ({ input, ctx }) => {
      // Custom rate limit for this specific operation
      const customLimit = await checkRateLimit(`create-workflow:${ctx.userId}`);
      if (!customLimit.success) {
        throw new TRPCError({
          code: 'TOO_MANY_REQUESTS',
          message: 'Too many workflow creations. Please wait.',
        });
      }

      // Performance tracking
      const startTime = Date.now();

      // Validation with logging
      if (input.nodes.length > 50) {
        logger.warn(
          {
            requestId: ctx.requestId,
            userId: ctx.userId,
            nodeCount: input.nodes.length,
          },
          'Large workflow creation attempted'
        );
      }

      // Business logic
      const workflow = await ctx.db.workflow.create({
        data: {
          name: input.name,
          userId: ctx.userId!,
        },
      });

      // Log completion
      logger.info(
        {
          requestId: ctx.requestId,
          userId: ctx.userId,
          workflowId: workflow.id,
          nodeCount: input.nodes.length,
          duration: Date.now() - startTime,
        },
        'Advanced workflow created'
      );

      return {
        id: workflow.id,
        name: workflow.name,
        nodeCount: input.nodes.length,
      };
    }),
});
```

### Creating Custom Procedures

```typescript
import { protectedProcedure } from '@/trpc/init';
import { checkRateLimit } from '@/lib/rate-limit';

// Stricter rate limit for expensive operations
const expensiveProcedure = protectedProcedure.use(async ({ ctx, next }) => {
  const result = await checkRateLimit(`expensive:${ctx.userId}`);

  if (!result.success) {
    throw new TRPCError({
      code: 'TOO_MANY_REQUESTS',
      message: 'Expensive operation rate limit exceeded',
    });
  }

  return next({
    ctx: {
      ...ctx,
      expensiveRateLimit: result,
    },
  });
});

// Use it
export const myRouter = createTRPCRouter({
  expensiveOperation: expensiveProcedure.mutation(async ({ ctx }) => {
    // Your expensive operation
  }),
});
```

---

## 📊 Monitoring Dashboard

### Viewing Logs

```bash
# Real-time logs
pnpm logs

# Filter by request ID
pnpm logs | grep "requestId-abc-123"

# Filter by user
pnpm logs | grep "userId-xyz-789"

# Filter slow queries
pnpm logs | grep "Slow tRPC request"
```

### Database Queries

```sql
-- Recent audit activity
SELECT * FROM audit_log
ORDER BY timestamp DESC
LIMIT 100;

-- User activity
SELECT * FROM audit_log
WHERE "userId" = 'user-id'
ORDER BY timestamp DESC;

-- Specific workflow activity
SELECT * FROM audit_log
WHERE "entityType" = 'WORKFLOW'
  AND "entityId" = 'workflow-id'
ORDER BY timestamp DESC;

-- Rate limit violations (from logs)
-- Check application logs for "Rate limit exceeded" messages
```

---

## 🧪 Testing

### Example Test

```typescript
import { appRouter } from '@/trpc/routers/_app';
import { createTRPCContext } from '@/trpc/init';

describe('Enhanced tRPC Features', () => {
  it('should track request ID', async () => {
    const ctx = await createTRPCContext();
    expect(ctx.requestId).toBeDefined();
  });

  it('should enforce rate limiting', async () => {
    // Make 101 requests rapidly
    // 101st should fail with TOO_MANY_REQUESTS
  });

  it('should create audit log', async () => {
    const caller = appRouter.createCaller(await createTRPCContext());
    const result = await caller.workflows.create({ name: 'Test' });

    const auditLog = await db.auditLog.findFirst({
      where: { entityId: result.id },
    });

    expect(auditLog).toBeDefined();
    expect(auditLog?.action).toBe('CREATE');
  });
});
```

---

## 🚨 Troubleshooting

### Rate Limiting Not Working

- Check Upstash Redis credentials in `.env.local`
- Verify Redis is accessible
- Check logs for "Rate limiting is disabled" warning

### Audit Logs Not Created

- Ensure returned object has `id` field
- Check that middleware is properly applied
- Verify database connection
- Check logs for audit creation errors

### Request ID Missing

- Ensure using `protectedProcedure` or `publicProcedure`
- Check context creation in `init.ts`

### Performance Issues

- Check for slow query warnings in logs
- Consider adding database indexes
- Optimize expensive operations
- Use caching where appropriate

---

## 📚 Related Documentation

- [Phase 1 Implementation](../PHASE-1-COMPLETE.md) - Infrastructure setup
- [Rate Limiting](../lib/rate-limit.ts) - Rate limiting utilities
- [Audit Logging](../lib/audit.ts) - Audit logging utilities
- [Request ID](../lib/request-id.ts) - Request tracking utilities
- [Logger](../lib/logger.ts) - Structured logging

---

## 🎉 Summary

With these enhanced features, every tRPC request now includes:

- ✅ Unique request ID for tracing
- ✅ Automatic rate limiting (configurable)
- ✅ Structured logging with context
- ✅ Opt-in audit logging for CRUD operations
- ✅ Performance monitoring
- ✅ Enhanced error tracking

All of this works automatically with minimal code changes!
