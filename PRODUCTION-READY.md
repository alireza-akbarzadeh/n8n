# Production-Ready Configuration Roadmap

This document outlines recommended configurations to make your n8n project production-ready, maintainable, and developer-friendly.

## 🎯 Priority Levels

- 🔴 **Critical** - Essential for production
- 🟡 **High** - Important for reliability and developer experience
- 🟢 **Medium** - Nice to have, improves workflow
- 🔵 **Optional** - Advanced features for scaling

---

## 1. Environment & Configuration Management 🔴

### Current State

- Basic `.env` file
- No environment validation

### Recommendations

#### A. Environment Variable Validation

Create `lib/env.ts` with Zod validation:

```typescript
import { z } from 'zod';

const envSchema = z.object({
  // Database
  DATABASE_URL: z.string().url(),

  // Auth
  NEXTAUTH_SECRET: z.string().min(32),
  NEXTAUTH_URL: z.string().url(),

  // Optional Services
  SENTRY_DSN: z.string().url().optional(),
  INNGEST_EVENT_KEY: z.string().optional(),

  // Node Environment
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
});

export const env = envSchema.parse(process.env);
```

**Benefits:**

- ✅ Catch missing environment variables at startup
- ✅ Type-safe environment access
- ✅ Clear documentation of required variables

#### B. Multiple Environment Files

```
.env.local           # Local development (gitignored)
.env.development     # Development defaults
.env.test           # Test environment
.env.production     # Production template (no secrets)
.env.example        # Template for new developers
```

**Files to create:**

- `.env.example` - Template with all variables documented
- `.env.test` - Test database and mock services

---

## 2. Code Quality & Standards 🔴

### Current State

- ✅ ESLint configured
- ❌ No Prettier
- ❌ No Git hooks
- ❌ No commit linting

### Recommendations

#### A. Add Prettier for Consistent Formatting

**Install:**

```bash
pnpm add -D prettier prettier-plugin-tailwindcss
```

**Create `.prettierrc.json`:**

```json
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "tabWidth": 2,
  "printWidth": 100,
  "plugins": ["prettier-plugin-tailwindcss"]
}
```

**Create `.prettierignore`:**

```
node_modules
.next
coverage
pnpm-lock.yaml
*.md
```

**Add scripts:**

```json
{
  "format": "prettier --write .",
  "format:check": "prettier --check ."
}
```

#### B. Husky + lint-staged (Git Hooks)

**Install:**

```bash
pnpm add -D husky lint-staged
pnpm exec husky init
```

**Configure `.husky/pre-commit`:**

```bash
#!/bin/sh
pnpm lint-staged
```

**Add to `package.json`:**

```json
{
  "lint-staged": {
    "*.{js,jsx,ts,tsx}": ["eslint --fix", "prettier --write"],
    "*.{json,md}": ["prettier --write"]
  }
}
```

#### C. Commitlint (Conventional Commits)

**Install:**

```bash
pnpm add -D @commitlint/cli @commitlint/config-conventional
```

**Create `commitlint.config.js`:**

```javascript
module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      [
        'feat', // New feature
        'fix', // Bug fix
        'docs', // Documentation
        'style', // Formatting
        'refactor', // Code restructuring
        'perf', // Performance
        'test', // Tests
        'chore', // Maintenance
        'ci', // CI/CD
        'build', // Build system
      ],
    ],
  },
};
```

**Create `.husky/commit-msg`:**

```bash
#!/bin/sh
pnpm commitlint --edit $1
```

---

## 3. Error Handling & Monitoring 🔴

### Current State

- ✅ Sentry configured
- ❌ No error boundaries
- ❌ No request logging

### Recommendations

#### A. Structured Logging (Pino)

**Install:**

```bash
pnpm add pino pino-pretty
```

**Create `lib/logger.ts`:**

```typescript
import pino from 'pino';

export const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  transport:
    process.env.NODE_ENV === 'development'
      ? { target: 'pino-pretty', options: { colorize: true } }
      : undefined,
});
```

**Usage:**

```typescript
logger.info({ userId: '123' }, 'User logged in');
logger.error({ err, requestId }, 'Request failed');
```

#### B. API Error Handler Middleware

**Create `lib/api-error.ts`:**

```typescript
import { NextResponse } from 'next/server';
import { ZodError } from 'zod';
import { logger } from './logger';

export class ApiError extends Error {
  constructor(
    public statusCode: number,
    message: string,
    public code?: string
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export function handleApiError(error: unknown) {
  logger.error({ err: error }, 'API Error');

  if (error instanceof ApiError) {
    return NextResponse.json(
      { error: error.message, code: error.code },
      { status: error.statusCode }
    );
  }

  if (error instanceof ZodError) {
    return NextResponse.json({ error: 'Validation failed', issues: error.issues }, { status: 400 });
  }

  return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
}
```

#### C. Enhanced Error Boundaries

**Create `components/error-boundary.tsx`:**

```typescript
'use client';

import { useEffect } from 'react';
import * as Sentry from '@sentry/nextjs';

export function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <h2 className="text-2xl font-bold">Something went wrong!</h2>
        <button onClick={reset}>Try again</button>
      </div>
    </div>
  );
}
```

---

## 4. Database & ORM Best Practices 🟡

### Current State

- ✅ Prisma configured
- ❌ No connection pooling optimization
- ❌ No query logging
- ❌ No database health checks

### Recommendations

#### A. Optimized Prisma Configuration

**Update `lib/db.ts`:**

```typescript
import { PrismaClient } from '@/prisma/generated/prisma/client';
import { logger } from './logger';

const prismaClientSingleton = () => {
  return new PrismaClient({
    log: [
      { level: 'query', emit: 'event' },
      { level: 'error', emit: 'stdout' },
      { level: 'warn', emit: 'stdout' },
    ],
  });
};

declare global {
  var prismaGlobal: undefined | ReturnType<typeof prismaClientSingleton>;
}

const prisma = globalThis.prismaGlobal ?? prismaClientSingleton();

if (process.env.NODE_ENV === 'development') {
  prisma.$on('query', (e) => {
    if (e.duration > 1000) {
      logger.warn({ duration: e.duration, query: e.query }, 'Slow query detected');
    }
  });
}

if (process.env.NODE_ENV !== 'production') {
  globalThis.prismaGlobal = prisma;
}

export default prisma;
```

#### B. Database Middleware for Soft Deletes

**Create `lib/prisma-middleware.ts`:**

```typescript
import prisma from './db';

prisma.$use(async (params, next) => {
  // Soft delete middleware
  if (params.action === 'delete') {
    params.action = 'update';
    params.args['data'] = { deletedAt: new Date() };
  }

  if (params.action === 'deleteMany') {
    params.action = 'updateMany';
    if (params.args.data != undefined) {
      params.args.data['deletedAt'] = new Date();
    } else {
      params.args['data'] = { deletedAt: new Date() };
    }
  }

  return next(params);
});
```

#### C. Add Database Seeding Scripts

**Create `prisma/seeds/dev-seed.ts`:**

```typescript
import prisma from '@/lib/db';

async function main() {
  // Create test users
  const user = await prisma.user.upsert({
    where: { email: 'test@example.com' },
    update: {},
    create: {
      email: 'test@example.com',
      name: 'Test User',
      emailVerified: true,
    },
  });

  console.log('✅ Database seeded:', { user });
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
```

---

## 5. API Architecture & Type Safety 🟡

### Current State

- ✅ tRPC configured
- ❌ No API rate limiting
- ❌ No request validation middleware
- ❌ No API versioning

### Recommendations

#### A. API Rate Limiting

**Install:**

```bash
pnpm add @upstash/ratelimit @upstash/redis
```

**Create `lib/rate-limit.ts`:**

```typescript
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

export const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(10, '10 s'),
  analytics: true,
});
```

**Usage in API routes:**

```typescript
const { success } = await ratelimit.limit(request.ip ?? 'anonymous');
if (!success) {
  return new Response('Rate limit exceeded', { status: 429 });
}
```

#### B. Request ID Middleware

**Create `middleware.ts` in root:**

```typescript
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { nanoid } from 'nanoid';

export function middleware(request: NextRequest) {
  const requestId = request.headers.get('x-request-id') ?? nanoid();

  const response = NextResponse.next();
  response.headers.set('x-request-id', requestId);

  return response;
}

export const config = {
  matcher: '/api/:path*',
};
```

#### C. Zod Schemas for API Validation

**Create `lib/schemas/` directory:**

```typescript
// lib/schemas/workflow.schema.ts
import { z } from 'zod';

export const createWorkflowSchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().max(500).optional(),
  isActive: z.boolean().default(false),
});

export type CreateWorkflowInput = z.infer<typeof createWorkflowSchema>;
```

---

## 6. Testing Strategy 🟡

### Current State

- ✅ Vitest + Playwright configured
- ✅ Example tests
- ❌ No test database setup
- ❌ No integration test helpers
- ❌ No visual regression testing

### Recommendations

#### A. Test Database Setup

**Create `tests/setup/test-db.ts`:**

```typescript
import { execSync } from 'child_process';
import prisma from '@/lib/db';

export async function setupTestDatabase() {
  // Reset database
  execSync('pnpm prisma migrate reset --force', {
    env: { ...process.env, DATABASE_URL: process.env.TEST_DATABASE_URL },
  });

  // Seed test data
  await prisma.user.create({
    data: { email: 'test@test.com', name: 'Test User' },
  });
}

export async function teardownTestDatabase() {
  await prisma.$disconnect();
}
```

#### B. Test Factories

**Install:**

```bash
pnpm add -D @faker-js/faker
```

**Create `tests/factories/user.factory.ts`:**

```typescript
import { faker } from '@faker-js/faker';
import prisma from '@/lib/db';

export async function createTestUser(data?: Partial<User>) {
  return prisma.user.create({
    data: {
      email: faker.internet.email(),
      name: faker.person.fullName(),
      emailVerified: true,
      ...data,
    },
  });
}
```

#### C. API Test Helpers

**Create `tests/helpers/api.ts`:**

```typescript
import { createCaller } from '@/trpc/server';

export function createTestCaller(userId?: string) {
  return createCaller({
    user: userId ? { id: userId } : null,
    req: {} as any,
  });
}
```

---

## 7. Documentation & Developer Experience 🟢

### Current State

- ✅ README.md
- ✅ TESTING.md
- ✅ HEALTH-CHECK.md
- ❌ No API documentation
- ❌ No architecture docs

### Recommendations

#### A. Add Swagger/OpenAPI for REST APIs

**Install:**

```bash
pnpm add next-swagger-doc swagger-ui-react
```

**Create API docs endpoint:**

```typescript
// app/api/docs/route.ts
import { createSwaggerSpec } from 'next-swagger-doc';

export async function GET() {
  const spec = createSwaggerSpec({
    definition: {
      openapi: '3.0.0',
      info: {
        title: 'n8n API',
        version: '1.0.0',
      },
    },
  });
  return Response.json(spec);
}
```

#### B. Component Documentation (Storybook)

**Install:**

```bash
pnpm dlx storybook@latest init
```

#### C. Architecture Decision Records (ADRs)

**Create `docs/adr/` directory:**

```markdown
# ADR-001: Use tRPC for Type-Safe APIs

## Status

Accepted

## Context

Need type-safe API communication between frontend and backend.

## Decision

Use tRPC for end-to-end type safety.

## Consequences

- Positive: Full type safety
- Negative: Learning curve for new developers
```

---

## 8. Performance & Optimization 🟢

### Recommendations

#### A. Bundle Analysis

**Add scripts:**

```json
{
  "analyze": "ANALYZE=true next build",
  "analyze:server": "BUNDLE_ANALYZE=server next build",
  "analyze:browser": "BUNDLE_ANALYZE=browser next build"
}
```

**Install:**

```bash
pnpm add -D @next/bundle-analyzer
```

#### B. Image Optimization Config

**Update `next.config.ts`:**

```typescript
images: {
  formats: ['image/avif', 'image/webp'],
  deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
  remotePatterns: [
    {
      protocol: 'https',
      hostname: '**.amazonaws.com',
    },
  ],
}
```

#### C. React Query Devtools

**Already have @tanstack/react-query, add:**

```bash
pnpm add -D @tanstack/react-query-devtools
```

---

## 9. Security Enhancements 🔴

### Recommendations

#### A. Security Headers

**Update `next.config.ts`:**

```typescript
async headers() {
  return [
    {
      source: '/(.*)',
      headers: [
        {
          key: 'X-Frame-Options',
          value: 'DENY',
        },
        {
          key: 'X-Content-Type-Options',
          value: 'nosniff',
        },
        {
          key: 'X-XSS-Protection',
          value: '1; mode=block',
        },
        {
          key: 'Referrer-Policy',
          value: 'strict-origin-when-cross-origin',
        },
      ],
    },
  ];
}
```

#### B. CORS Configuration

**Create `lib/cors.ts`:**

```typescript
export const corsHeaders = {
  'Access-Control-Allow-Origin': process.env.ALLOWED_ORIGINS || '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};
```

#### C. Input Sanitization

**Install:**

```bash
pnpm add dompurify isomorphic-dompurify
```

---

## 10. CI/CD Pipeline 🟡

### Current State

- ✅ Basic GitHub Actions workflow
- ❌ No deployment pipeline
- ❌ No preview deployments

### Recommendations

#### A. Enhanced CI Workflow

**Update `.github/workflows/ci.yml`:**

```yaml
name: CI/CD Pipeline

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

jobs:
  quality:
    name: Code Quality
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v2
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'pnpm'

      - run: pnpm install --frozen-lockfile
      - run: pnpm format:check
      - run: pnpm lint
      - run: pnpm tsc --noEmit

  test:
    needs: quality
    # ... existing test jobs

  build:
    needs: [quality, test]
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: pnpm build

  deploy-preview:
    if: github.event_name == 'pull_request'
    needs: build
    runs-on: ubuntu-latest
    steps:
      - name: Deploy to Vercel Preview
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: \${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: \${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: \${{ secrets.VERCEL_PROJECT_ID }}
```

#### B. Dependabot

**Create `.github/dependabot.yml`:**

```yaml
version: 2
updates:
  - package-ecosystem: 'npm'
    directory: '/'
    schedule:
      interval: 'weekly'
    open-pull-requests-limit: 10
    groups:
      dev-dependencies:
        dependency-type: 'development'
      production-dependencies:
        dependency-type: 'production'
```

---

## 11. Monitoring & Observability 🟢

### Recommendations

#### A. Performance Monitoring

**Already have Sentry, enhance with:**

```typescript
// app/layout.tsx
import * as Sentry from '@sentry/nextjs';

Sentry.setTag('deployment', process.env.VERCEL_ENV || 'local');

// Track Web Vitals
export function reportWebVitals(metric: NextWebVitalsMetric) {
  Sentry.captureMessage(\`\${metric.name}: \${metric.value}\`, 'info');
}
```

#### B. Uptime Monitoring

**Services to consider:**

- Better Uptime
- Checkly
- Pingdom

**Configure alerts for:**

- `/api/health` endpoint
- Database connectivity
- Response time > 2s

---

## 12. Developer Tools 🟢

### Recommendations

#### A. VS Code Workspace Settings

**Create `.vscode/settings.json`:**

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "typescript.tsdk": "node_modules/typescript/lib",
  "typescript.enablePromptUseWorkspaceTsdk": true
}
```

**Create `.vscode/extensions.json`:**

```json
{
  "recommendations": [
    "esbenp.prettier-vscode",
    "dbaeumer.vscode-eslint",
    "bradlc.vscode-tailwindcss",
    "prisma.prisma",
    "ms-playwright.playwright"
  ]
}
```

#### B. Local Development Scripts

**Add to `package.json`:**

```json
{
  "dev:debug": "NODE_OPTIONS='--inspect' next dev",
  "dev:turbo": "next dev --turbo",
  "db:reset": "pnpm prisma migrate reset && pnpm db:seed",
  "db:studio": "prisma studio",
  "clean": "rm -rf .next node_modules",
  "reinstall": "pnpm clean && pnpm install"
}
```

---

## Implementation Priority

### Phase 1: Critical (Week 1-2)

1. ✅ Environment validation
2. ✅ Error handling & logging
3. ✅ Security headers
4. ✅ Prettier + Git hooks
5. ✅ Enhanced CI/CD

### Phase 2: High Priority (Week 3-4)

1. ✅ Rate limiting
2. ✅ Database optimizations
3. ✅ Test helpers & factories
4. ✅ API documentation
5. ✅ Monitoring setup

### Phase 3: Quality of Life (Week 5-6)

1. ✅ Storybook
2. ✅ Bundle analysis
3. ✅ ADR documentation
4. ✅ VS Code settings
5. ✅ Performance monitoring

---

## Quick Start Checklist

Copy this to a GitHub Project or Linear for tracking:

### Environment & Config

- [ ] Create `lib/env.ts` with Zod validation
- [ ] Add `.env.example` with all variables
- [ ] Set up environment-specific configs

### Code Quality

- [ ] Install and configure Prettier
- [ ] Set up Husky with lint-staged
- [ ] Add commitlint for conventional commits
- [ ] Configure VS Code workspace settings

### Error Handling

- [ ] Add Pino logger
- [ ] Create API error handler
- [ ] Enhance error boundaries

### Database

- [ ] Optimize Prisma configuration
- [ ] Add query logging
- [ ] Create database seed scripts
- [ ] Set up test database

### Security

- [ ] Add security headers
- [ ] Implement rate limiting
- [ ] Configure CORS
- [ ] Add input sanitization

### Testing

- [ ] Create test factories
- [ ] Add test database setup
- [ ] Create API test helpers

### Documentation

- [ ] Add API documentation
- [ ] Create ADRs
- [ ] Set up Storybook (optional)

### CI/CD

- [ ] Enhance GitHub Actions workflow
- [ ] Add Dependabot
- [ ] Set up preview deployments

### Monitoring

- [ ] Configure uptime monitoring
- [ ] Set up performance tracking
- [ ] Add alerting

---

## Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Best Practices](https://www.prisma.io/docs/guides/performance-and-optimization)
- [tRPC Documentation](https://trpc.io/docs)
- [Conventional Commits](https://www.conventionalcommits.org/)
- [12 Factor App](https://12factor.net/)

---

**Last Updated:** November 17, 2025
