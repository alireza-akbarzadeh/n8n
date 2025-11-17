# Quick Reference Guide

This guide provides quick access to common patterns and commands for your newly configured project.

## 🚀 Daily Commands

```bash
# Development
pnpm dev              # Start development server
pnpm dev:all          # Start all services (Next.js, Inngest, etc.)

# Code Quality
pnpm format           # Format all code with Prettier
pnpm format:check     # Check if code is formatted
pnpm lint             # Run ESLint

# Testing
pnpm test             # Run unit tests
pnpm test:watch       # Run tests in watch mode
pnpm test:coverage    # Run tests with coverage
pnpm e2e              # Run E2E tests
pnpm test:ui          # Open Vitest UI

# Database
pnpm db:studio        # Open Prisma Studio
pnpm db:migrate       # Run migrations
pnpm db:reset         # Reset database
pnpm db:seed          # Seed database

# Build
pnpm build            # Production build
pnpm start            # Start production server
```

## 📝 Code Patterns

### Environment Variables

```typescript
import { env, isDevelopment, isProduction } from '@/lib/env';

// Type-safe access to environment variables
const dbUrl = env.DATABASE_URL;
const authSecret = env.BETTER_AUTH_SECRET;

// Environment checks
if (isDevelopment) {
  // Development-only code
}
```

### Logging

```typescript
import { logger, createLogger, startTimer } from '@/lib/logger';

// Basic logging
logger.info('Server started');
logger.error({ err }, 'Operation failed');
logger.warn({ duration: 1500 }, 'Slow operation');

// With context
logger.info({ userId: '123', action: 'login' }, 'User logged in');

// Child logger with bound context
const requestLogger = createLogger({ requestId: 'abc-123' });
requestLogger.info('Processing request');

// Timing operations
const end = startTimer();
await expensiveOperation();
end({ operation: 'database-query' }, 'Query completed');

// Sensitive data is automatically redacted
logger.info({ password: 'secret123', email: 'user@example.com' });
// Output: { password: '[REDACTED]', email: 'user@example.com' }
```

### Error Handling

#### API Routes

```typescript
import { ApiError, withErrorHandler } from '@/lib/api-error';
import { NextResponse } from 'next/server';

// Option 1: Use wrapper (recommended)
export const GET = withErrorHandler(async (request) => {
  // Errors are automatically caught and formatted
  const data = await fetchData();
  return NextResponse.json(data);
});

// Option 2: Manual error handling
export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Throw predefined errors
    if (!body.name) {
      throw ApiError.badRequest('Name is required');
    }

    if (!authorized) {
      throw ApiError.unauthorized();
    }

    // Create custom errors
    throw new ApiError(418, "I'm a teapot", 'TEAPOT_ERROR');
  } catch (error) {
    return handleApiError(error, requestId);
  }
}
```

#### Predefined Error Types

```typescript
ApiError.badRequest(message, details?)       // 400
ApiError.unauthorized(message?)              // 401
ApiError.forbidden(message?)                 // 403
ApiError.notFound(message?)                  // 404
ApiError.conflict(message, details?)         // 409
ApiError.unprocessableEntity(message, details?) // 422
ApiError.tooManyRequests(message?)           // 429
ApiError.internal(message?, details?)        // 500
ApiError.serviceUnavailable(message?)        // 503
```

### Database Queries

```typescript
import prisma from '@/lib/db';
import { logger } from '@/lib/logger';

// Queries are automatically logged in development
// Slow queries (> 1 second) trigger warnings

async function getUser(id: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw ApiError.notFound('User not found');
    }

    return user;
  } catch (error) {
    // Prisma errors are automatically handled by ApiError
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      logger.error({ code: error.code }, 'Database error');
    }
    throw error;
  }
}
```

### tRPC Procedures

```typescript
import { createTRPCRouter, publicProcedure } from '@/trpc/init';
import { z } from 'zod';
import { ApiError } from '@/lib/api-error';

export const workflowRouter = createTRPCRouter({
  getById: publicProcedure.input(z.object({ id: z.string() })).query(async ({ input, ctx }) => {
    const workflow = await ctx.prisma.workflow.findUnique({
      where: { id: input.id },
    });

    if (!workflow) {
      throw ApiError.notFound('Workflow not found');
    }

    return workflow;
  }),

  create: publicProcedure
    .input(
      z.object({
        name: z.string().min(1).max(100),
        description: z.string().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      // Zod validation errors are automatically handled
      return await ctx.prisma.workflow.create({
        data: input,
      });
    }),
});
```

## 🎨 Commit Message Format

```bash
# Format: <type>(<scope>): <subject>

# Types:
feat:      # New feature
fix:       # Bug fix
docs:      # Documentation changes
style:     # Code style (formatting, semicolons)
refactor:  # Code restructuring
perf:      # Performance improvements
test:      # Adding/updating tests
chore:     # Maintenance tasks
ci:        # CI/CD changes
build:     # Build system or dependencies
revert:    # Revert previous commit

# Examples:
git commit -m "feat(auth): add GitHub OAuth provider"
git commit -m "fix(api): handle null user in session"
git commit -m "docs: update API documentation"
git commit -m "refactor(workflows): extract list logic to hook"
git commit -m "perf(db): add index on user email"
git commit -m "test(auth): add login flow tests"
```

## 🔍 Debugging

### VS Code Debug Configurations

1. **Next.js Server-side** - Debug API routes and server components
2. **Next.js Client-side** - Debug React components in Chrome
3. **Next.js Full Stack** - Debug both server and client simultaneously
4. **Vitest Current File** - Debug the current test file

Press `F5` or go to Run & Debug panel to start debugging.

### Console Logging

```typescript
// Development-only logs
if (isDevelopment) {
  console.log('Debug info:', data);
}

// Use structured logging instead
logger.debug({ data }, 'Processing data');
```

## 🧪 Testing Patterns

### Unit Tests

```typescript
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

describe('Component', () => {
  it('should render correctly', () => {
    render(<Component />);
    expect(screen.getByText('Hello')).toBeInTheDocument();
  });

  it('should handle click', async () => {
    const onClick = vi.fn();
    render(<Component onClick={onClick} />);

    await userEvent.click(screen.getByRole('button'));
    expect(onClick).toHaveBeenCalledOnce();
  });
});
```

### E2E Tests

```typescript
import { test, expect } from '@playwright/test';

test('user can log in', async ({ page }) => {
  await page.goto('/login');

  await page.fill('input[name="email"]', 'user@example.com');
  await page.fill('input[name="password"]', 'password123');
  await page.click('button[type="submit"]');

  await expect(page).toHaveURL('/workflows');
});
```

## 🔐 Security Checklist

- [x] Environment variables validated at startup
- [x] Security headers configured (HSTS, CSP, X-Frame-Options)
- [x] Passwords and secrets redacted from logs
- [x] CORS configured (add to middleware if needed)
- [x] Request rate limiting (add Upstash Redis if needed)
- [ ] Input sanitization (add DOMPurify if accepting HTML)
- [ ] SQL injection protection (Prisma handles this)
- [ ] CSRF protection (verify Better Auth settings)

## 📊 Monitoring

### Health Checks

```bash
# Available endpoints:
curl http://localhost:3000/api/health           # Basic health
curl http://localhost:3000/api/health/detailed  # Detailed diagnostics
curl http://localhost:3000/api/health/live      # Liveness probe
curl http://localhost:3000/api/health/ready     # Readiness probe

# Visual dashboard:
open http://localhost:3000/api/health/dashboard
```

### Application Logs

```bash
# Development (pretty printed):
pnpm dev

# Production (JSON):
NODE_ENV=production pnpm start
```

### Database Monitoring

```bash
# Slow queries are automatically logged
# Check logs for warnings about queries > 1 second
```

## 🔧 Troubleshooting

### Environment Issues

```bash
# Verify environment variables
node -e "require('./lib/env.ts')"

# Check which env file is loaded
echo $NODE_ENV
```

### Database Issues

```bash
# Reset database
pnpm db:reset

# Check Prisma connection
pnpm prisma db pull

# View current schema
pnpm db:studio
```

### Build Issues

```bash
# Clear Next.js cache
rm -rf .next

# Clear node_modules and reinstall
rm -rf node_modules pnpm-lock.yaml
pnpm install

# Type check without building
pnpm tsc --noEmit
```

### Git Hook Issues

```bash
# Bypass hooks temporarily (not recommended)
git commit --no-verify -m "emergency fix"

# Reinstall hooks
pnpm exec husky init
```

## 📚 Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [tRPC Documentation](https://trpc.io/docs)
- [Pino Logger](https://getpino.io/)
- [Prettier](https://prettier.io/)
- [Conventional Commits](https://www.conventionalcommits.org/)

---

**Keep this guide handy for quick reference during development!** 📖
