# 🧰 Scripts & Utilities Reference

Complete reference for all scripts, utilities, and helper functions in the project.

---

## 📜 Package Scripts

### Development Scripts

#### `pnpm dev`

Starts Next.js development server with hot-reload.

```bash
pnpm dev
```

- **URL:** http://localhost:3000
- **Port:** 3000 (customizable with `-p`)
- **Features:** Hot reload, Fast Refresh, Source maps

#### `pnpm dev:all`

Starts all services simultaneously using mprocs.

```bash
pnpm dev:all
```

**Services started:**

1. Next.js dev server (port 3000)
2. Prisma Studio (port 5555)
3. Inngest dev server (port 8288)

**Configuration:** `mprocs.yaml`

#### `pnpm build`

Builds the application for production.

```bash
pnpm build
```

- Compiles TypeScript
- Optimizes bundles
- Generates static pages
- Creates `.next` folder

#### `pnpm start`

Starts production server (requires `pnpm build` first).

```bash
pnpm build && pnpm start
```

---

### Database Scripts

#### `pnpm db:studio`

Opens Prisma Studio - visual database editor.

```bash
pnpm db:studio
```

- **URL:** http://localhost:5555
- **Features:**
  - Browse tables
  - Edit records
  - View relationships
  - Execute queries

**Use Cases:**

- Inspect data during development
- Manually fix data issues
- Test database relationships

#### `pnpm db:generate`

Generates Prisma Client from schema.

```bash
pnpm db:generate
```

**When to run:**

- After changing `schema.prisma`
- After pulling schema changes
- When Prisma Client is out of sync

**Output:** `node_modules/.prisma/client/`

#### `pnpm db:migrate`

Creates and applies database migrations.

```bash
pnpm db:migrate
```

**Interactive prompts:**

1. Migration name (e.g., "add_workflow_description")
2. Confirmation to apply

**Creates:**

- Migration SQL file in `prisma/migrations/`
- Updates database schema
- Regenerates Prisma Client

**Example:**

```bash
$ pnpm db:migrate
? Enter a name for the new migration: › add_workflow_description
✔ Migration created: 20231117_add_workflow_description
✔ Applied migration 20231117_add_workflow_description
```

#### `pnpm db:deploy`

Applies migrations in production (no prompts).

```bash
pnpm db:deploy
```

**Use in CI/CD:**

```bash
# GitHub Actions, etc.
- name: Deploy migrations
  run: pnpm db:deploy
```

#### `pnpm db:reset`

Resets database to clean state.

```bash
pnpm db:reset
```

**⚠️ WARNING: Deletes ALL data!**

**Actions:**

1. Drops database
2. Creates fresh database
3. Applies all migrations
4. Runs seed script

**Use cases:**

- Reset development environment
- Clear test data
- Fix migration conflicts

#### `pnpm db:push`

Pushes schema changes without migrations (dev only).

```bash
pnpm db:push
```

**⚠️ Use carefully:**

- No migration history
- Can cause data loss
- Only for prototyping

**Better alternative:** `pnpm db:migrate`

#### `pnpm db:seed`

Seeds database with test data.

```bash
pnpm db:seed
```

**Script:** `prisma/seed.ts`

**Example seed data:**

```typescript
// prisma/seed.ts
const users = [
  {
    name: 'Alice',
    email: 'alice@example.com',
  },
  {
    name: 'Bob',
    email: 'bob@example.com',
  },
];

for (const user of users) {
  await prisma.user.create({ data: user });
}
```

---

### Testing Scripts

#### `pnpm test`

Runs all unit tests once.

```bash
pnpm test
```

**Alias for:** `vitest --run`

**Output:**

```
✓ tests/unit/workflows/workflow.entity.test.ts (22)
✓ tests/unit/auth/user.entity.test.ts (14)
✓ tests/unit/executions/execution.entity.test.ts (14)

Test Files  8 passed (8)
     Tests  80 passed (80)
```

#### `pnpm test:watch`

Runs tests in watch mode (re-runs on changes).

```bash
pnpm test:watch
```

**Features:**

- Auto-rerun on file changes
- Smart re-run (only affected tests)
- Interactive mode (press keys for actions)

**Keyboard shortcuts:**

- `a` - Run all tests
- `f` - Run only failed tests
- `q` - Quit
- `Enter` - Trigger test run

#### `pnpm test:coverage`

Generates test coverage report.

```bash
pnpm test:coverage
```

**Output:**

- Terminal summary
- HTML report in `coverage/`

**View HTML report:**

```bash
open coverage/index.html
```

**Coverage thresholds** (in `vitest.config.ts`):

```typescript
coverage: {
  statements: 80,
  branches: 80,
  functions: 80,
  lines: 80,
}
```

#### `pnpm test:ui`

Opens Vitest UI for visual test exploration.

```bash
pnpm test:ui
```

- **URL:** http://localhost:51204
- **Features:**
  - Visual test tree
  - Run individual tests
  - View test output
  - Debug tests

#### `pnpm e2e`

Runs end-to-end tests with Playwright.

```bash
pnpm e2e
```

**Alias for:** `playwright test`

**Runs:**

- All tests in `tests/e2e/`
- In headless mode
- Across multiple browsers (Chromium, Firefox, WebKit)

**Example output:**

```
Running 15 tests using 3 workers

✓ tests/e2e/auth.spec.ts:3:1 › user can login (1s)
✓ tests/e2e/workflows.spec.ts:5:1 › create workflow (2s)

15 passed (45s)
```

#### `pnpm e2e:headed`

Runs E2E tests with visible browser.

```bash
pnpm e2e:headed
```

**Use cases:**

- See what tests are doing
- Debug failing tests
- Demo test scenarios

#### `pnpm e2e:debug`

Opens Playwright Inspector for debugging.

```bash
pnpm e2e:debug
```

**Features:**

- Step through tests
- Inspect elements
- View network requests
- Modify selectors live

#### `pnpm e2e:ui`

Opens Playwright UI mode.

```bash
pnpm e2e:ui
```

**Features:**

- Visual test runner
- Time-travel debugging
- Watch mode
- Browser picker

#### `pnpm test:ci`

Runs all tests for CI/CD pipeline.

```bash
pnpm test:ci
```

**Runs:**

1. Unit tests with coverage
2. E2E tests with GitHub reporter

**Use in GitHub Actions:**

```yaml
- name: Run tests
  run: pnpm test:ci
```

---

### Code Quality Scripts

#### `pnpm lint`

Runs ESLint on all files.

```bash
pnpm lint
```

**Checks:**

- Code style violations
- Potential bugs
- Best practice violations

**Auto-fix:**

```bash
pnpm lint --fix
```

#### `pnpm format`

Formats code with Prettier.

```bash
pnpm format
```

**Formats:**

- TypeScript/JavaScript
- JSON
- Markdown
- CSS

**Config:** `.prettierrc`

#### `pnpm format:check`

Checks if code is formatted (doesn't modify).

```bash
pnpm format:check
```

**Use in CI:**

```yaml
- name: Check formatting
  run: pnpm format:check
```

---

### Background Jobs Scripts

#### `pnpm inngest:dev`

Starts Inngest dev server.

```bash
pnpm inngest:dev
```

- **URL:** http://localhost:8288
- **Features:**
  - View job runs
  - Trigger jobs manually
  - See job logs
  - Debug failures

**Functions defined in:** `src/inngest/functions.ts`

---

## 🛠️ Utility Scripts

Custom scripts in `scripts/` directory.

### `check-connections.ts`

Validates database connections.

```bash
npx tsx scripts/check-connections.ts
```

**Purpose:** Checks for invalid connection data in database.

**Example output:**

```
Found 25 connections
Invalid connections found:
- ID: cm3x..., fromOutput: "", toInput: ""
```

**Source:** `scripts/check-connections.ts`

### `google-form-trigger-scripts.ts`

Google Forms integration utilities.

```bash
npx tsx scripts/google-form-trigger-scripts.ts
```

**Purpose:** Scripts for Google Forms webhook setup.

---

## 🧩 Utility Functions

### Core Utilities

#### `Result<T, E>` Pattern

**Location:** `src/core/types/common.types.ts`

**Usage:**

```typescript
import { Result } from '@/core/types/common.types';

// Create success result
const success = Result.ok(data);

// Create failure result
const failure = Result.fail('Error message');

// Check result
if (result.success) {
  console.log(result.data);
} else {
  console.error(result.error);
}
```

**Type Definition:**

```typescript
type Result<T, E> = { success: true; data: T } | { success: false; error: E };
```

#### `ok()` Response Helper

**Location:** `src/shared/ui/utils/utils.ts`

**Usage:**

```typescript
import { ok } from '@/lib/utils';

return ok({
  data: workflow,
  message: 'Workflow created successfully',
  code: 201,
});
```

**Returns:**

```typescript
{
  success: true,
  data: T,
  message?: string,
  code?: number,
}
```

---

### Domain Utilities

#### `ID` Value Object

**Location:** `src/shared/domain/value-objects/id.vo.ts`

**Usage:**

```typescript
import { ID } from '@/shared/domain/value-objects/id.vo';

// Generate new ID
const id = ID.generate();
console.log(id.getValue()); // "cm3x..."

// Create from existing value
const existingId = ID.create('cm3x...');

// Compare IDs
if (id1.equals(id2)) {
  console.log('IDs are equal');
}
```

**Features:**

- Uses CUID2 for unique IDs
- Immutable value object
- Type-safe comparison

#### `BaseEntity`

**Location:** `src/shared/domain/entities/base.entity.ts`

**Usage:**

```typescript
import { BaseEntity } from '@/shared/domain/entities/base.entity';

export class MyEntity extends BaseEntity<MyEntityProps> {
  private constructor(id: ID, props: MyEntityProps) {
    super(id, props);
  }

  public static create(props: MyEntityProps, id?: ID): Result<MyEntity, string> {
    const entityId = id || ID.generate();
    return Result.ok(new MyEntity(entityId, props));
  }

  // Access base properties
  get id(): ID {
    return this._id;
  }

  get createdAt(): Date {
    return this.createdAt;
  }

  // Update timestamp
  protected touch(): void {
    this.touch();
  }
}
```

---

### Infrastructure Utilities

#### Logger (Pino)

**Location:** `src/shared/infrastructure/logger/pino.logger.ts`

**Usage:**

```typescript
import { logger } from '@/shared/infrastructure/logger/pino.logger';

// Info logging
logger.info('User logged in', { userId, timestamp });

// Error logging
logger.error('Failed to save workflow', { error, workflowId });

// Debug logging (only in development)
logger.debug('Processing node', { nodeId, nodeType });

// Warning logging
logger.warn('Rate limit approaching', { userId, count });
```

**Log Levels:**

- `trace` - Very detailed
- `debug` - Debug information
- `info` - General information
- `warn` - Warnings
- `error` - Errors
- `fatal` - Fatal errors

**Configuration:**

```env
# .env.local
LOG_LEVEL=info
```

#### Audit Logging

**Location:** `src/shared/application/services/audit.ts`

**Usage:**

```typescript
import { auditWorkflowCreate, auditWorkflowUpdate, auditWorkflowDelete } from '@/lib/audit';

// Audit workflow creation
await auditWorkflowCreate(workflowId, userId, {
  workflowName: 'My Workflow',
  initialNodeType: 'INITIAL',
  requestId: ctx.requestId,
});

// Audit workflow update
await auditWorkflowUpdate(workflowId, userId, {
  action: 'structure_update',
  nodeCount: 5,
  edgeCount: 4,
  requestId: ctx.requestId,
});

// Audit workflow deletion
await auditWorkflowDelete(workflowId, userId, {
  workflowName: 'My Workflow',
  requestId: ctx.requestId,
});
```

**Audit Log Schema:**

```typescript
{
  id: string;
  userId: string;
  action: string;
  resourceType: string;
  resourceId: string;
  metadata: object;
  requestId: string;
  timestamp: Date;
}
```

#### Encryption

**Location:** `src/shared/infrastructure/encryption/crypto.ts`

**Usage:**

```typescript
import { encrypt, decrypt } from '@/lib/encryption';

// Encrypt sensitive data
const encrypted = encrypt('my-api-key');

// Decrypt
const decrypted = decrypt(encrypted);
```

**Algorithm:** AES-256-CBC

**Configuration:**

```env
ENCRYPTION_KEY=<32-char-base64-key>
```

---

### UI Utilities

#### `cn()` - Class Names

**Location:** `src/shared/ui/utils/utils.ts`

**Usage:**

```typescript
import { cn } from '@/lib/utils';

<div className={cn(
  'base-class',
  isActive && 'active-class',
  isDisabled && 'disabled-class',
  className  // User-provided classes
)} />
```

**Features:**

- Conditional classes
- Merges Tailwind classes
- Deduplicates classes
- Type-safe

**Examples:**

```typescript
// Conditional classes
cn('btn', isLoading && 'btn-loading');
// → "btn btn-loading" (if isLoading is true)

// Merge with user classes
cn('btn btn-primary', className);
// → "btn btn-primary user-class"

// Tailwind class merging
cn('px-2 py-1', 'px-4');
// → "py-1 px-4" (px-4 overwrites px-2)
```

#### Date Formatting

**Location:** Uses `date-fns` library

**Usage:**

```typescript
import { format, formatDistance } from 'date-fns';

// Format date
format(new Date(), 'MMM dd, yyyy');
// → "Nov 17, 2025"

// Relative time
formatDistance(new Date(2025, 0, 1), new Date());
// → "10 months ago"
```

---

## 🔧 Configuration Files

### `mprocs.yaml`

Multi-process runner configuration.

```yaml
procs:
  next:
    cmd: ['pnpm', 'dev']

  db:studio:
    cmd: ['pnpm', 'db:studio']

  inngest:
    cmd: ['pnpm', 'inngest:dev']
```

**Usage:** `pnpm dev:all`

### `vitest.config.ts`

Vitest testing configuration.

**Key settings:**

- Test environment: `jsdom`
- Path aliases: `@/` → `src/`
- Coverage threshold: 80%
- Setup files
- Mock handling

### `playwright.config.ts`

Playwright E2E testing configuration.

**Key settings:**

- Browsers: Chromium, Firefox, WebKit
- Base URL: http://localhost:3000
- Retry: 2 times on CI
- Screenshot on failure
- Video on first retry

### `tsconfig.json`

TypeScript configuration.

**Key settings:**

- Strict mode enabled
- Path aliases
- JSX: React
- Module resolution: Bundler

### `eslint.config.mjs`

ESLint configuration.

**Rules:**

- Next.js recommended
- TypeScript recommended
- React hooks rules
- Import order

### `prettier.config.js`

Prettier configuration.

**Settings:**

- Single quotes
- No semicolons
- 2 space indent
- Tailwind plugin

---

## 📚 Quick Reference

### Most Used Commands

```bash
# Start development
pnpm dev:all

# Run tests
pnpm test:watch

# Check code quality
pnpm lint && pnpm format:check

# Database operations
pnpm db:studio
pnpm db:migrate

# View jobs
# Open http://localhost:8288
```

### Most Used Utilities

```typescript
// Result pattern
const result = someOperation();
if (result.success) { /* use result.data */ }

// Logging
logger.info('Message', { context });

// ID generation
const id = ID.generate();

// Class names
<div className={cn('base', isActive && 'active')} />
```

---

## 🎯 Tips & Tricks

### Run Specific Tests

```bash
# Single file
pnpm test tests/unit/workflows/workflow.entity.test.ts

# Pattern matching
pnpm test workflow

# Watch specific file
pnpm test:watch workflow.entity
```

### Debug Prisma Queries

```env
# .env.local
DEBUG=prisma:query
```

### Run TypeScript Checks

```bash
# Check types without building
npx tsc --noEmit

# Watch mode
npx tsc --noEmit --watch
```

### Clear Caches

```bash
# Next.js cache
rm -rf .next

# Prisma cache
rm -rf node_modules/.prisma

# All caches
rm -rf .next node_modules/.prisma coverage
```

---

**For more information, see:**

- [README.md](./README.md) - Project overview
- [ARCHITECTURE.md](./ARCHITECTURE.md) - System architecture
- [DEVELOPER_GUIDE.md](./DEVELOPER_GUIDE.md) - Development guide
