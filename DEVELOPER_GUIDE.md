# 👨‍💻 Developer Guide

Complete guide for developers new to this codebase.

## 📚 Table of Contents

1. [First Day Setup](#first-day-setup)
2. [Understanding the Codebase](#understanding-the-codebase)
3. [Making Your First Change](#making-your-first-change)
4. [Common Tasks](#common-tasks)
5. [Useful Scripts & Utils](#useful-scripts--utils)
6. [Debugging Tips](#debugging-tips)
7. [Best Practices](#best-practices)

---

## 🚀 First Day Setup

### Step 1: Prerequisites

Install these tools:

```bash
# Node.js (use nvm for version management)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
nvm install 20
nvm use 20

# pnpm
npm install -g pnpm

# PostgreSQL (macOS)
brew install postgresql@14
brew services start postgresql@14

# (Optional) Docker for PostgreSQL
docker run --name n8n-postgres -e POSTGRES_PASSWORD=postgres -p 5432:5432 -d postgres:14
```

### Step 2: Clone & Install

```bash
git clone <repository-url>
cd n8n
pnpm install
```

### Step 3: Environment Setup

```bash
# Copy environment template
cp .env.example .env.local

# Generate secure keys
openssl rand -base64 32  # Use for BETTER_AUTH_SECRET
openssl rand -base64 32  # Use for ENCRYPTION_KEY

# Edit .env.local with your editor
code .env.local  # or nano, vim, etc.
```

**Minimum required in `.env.local`:**

```env
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/n8n_dev?schema=public
BETTER_AUTH_SECRET=<generated-key-1>
BETTER_AUTH_URL=http://localhost:3000
ENCRYPTION_KEY=<generated-key-2>
NEXT_PUBLIC_APP_NAME=Nodebase
```

### Step 4: Database Setup

```bash
# Generate Prisma Client
pnpm db:generate

# Run migrations
pnpm db:migrate

# Open Prisma Studio to view data
pnpm db:studio
```

### Step 5: Start Development

```bash
# Option A: Start everything at once (Recommended)
pnpm dev:all

# Option B: Start services separately
# Terminal 1
pnpm dev

# Terminal 2 (optional)
pnpm db:studio

# Terminal 3 (optional)
pnpm inngest:dev
```

### Step 6: Verify Setup

1. Open http://localhost:3000
2. Create an account
3. Create a workflow
4. Open http://localhost:5555 (Prisma Studio) to see your data

✅ **You're ready to code!**

---

## 🧭 Understanding the Codebase

### Architecture in 5 Minutes

Think of the codebase like a building:

```
┌─────────────────────────────────────┐
│  PRESENTATION (What users see)      │  ← React components, pages
├─────────────────────────────────────┤
│  API (How users interact)           │  ← tRPC routers
├─────────────────────────────────────┤
│  APPLICATION (What to do)           │  ← Use cases (business operations)
├─────────────────────────────────────┤
│  DOMAIN (Business rules)            │  ← Entities (pure business logic)
├─────────────────────────────────────┤
│  INFRASTRUCTURE (How it's done)     │  ← Prisma, external APIs
└─────────────────────────────────────┘
```

### Key Folders

```
src/
├── app/                    # 🎨 Next.js pages (what users see)
├── components/             # 🧩 Reusable UI components
├── features/              # 📦 Feature modules (the main code)
│   ├── workflows/         # Workflow feature
│   │   ├── domain/        # Business logic (NO dependencies)
│   │   ├── application/   # Use cases (orchestration)
│   │   ├── infrastructure/# Database & external APIs
│   │   ├── api/           # tRPC endpoints
│   │   └── ui/            # Feature-specific components
│   └── auth/              # Authentication feature
├── shared/                # 🔧 Shared utilities
├── core/                  # ⚙️ Core config & types
└── trpc/                  # 🔌 API setup
```

### Request Flow Example

When a user creates a workflow:

```
1. User clicks "New Workflow" button
   ↓
2. React component calls tRPC mutation
   📂 src/app/(dashboard)/workflows/page.tsx

3. tRPC router receives request
   📂 src/features/workflows/api/workflows.router.ts

4. Router calls Use Case
   📂 src/features/workflows/application/use-cases/create-workflow.use-case.ts

5. Use Case creates Domain Entity
   📂 src/features/workflows/domain/entities/workflow.entity.ts

6. Use Case saves via Repository Interface
   📂 src/features/workflows/domain/repositories/workflow.repository.interface.ts

7. Prisma Repository implements save
   📂 src/features/workflows/infrastructure/repositories/prisma-workflow.repository.ts

8. Data is saved to PostgreSQL

9. Response flows back up the chain
```

---

## 🔨 Making Your First Change

### Task: Add a "description" field to workflows

#### Step 1: Update Domain Entity

```typescript
// src/features/workflows/domain/entities/workflow.entity.ts

export interface WorkflowProps {
  name: string;
  description?: string; // ← Add this
  userId: string;
  nodes: Node[];
  edges: Edge[];
  createdAt?: Date;
  updatedAt?: Date;
}

export class Workflow extends BaseEntity<WorkflowProps> {
  // ... existing code ...

  // Add getter
  get description(): string | undefined {
    return this.props.description;
  }

  // Add update method
  public updateDescription(description: string): Result<void, string> {
    if (description.length > 500) {
      return Result.fail('Description must be 500 characters or less');
    }

    this.props.description = description;
    this.touch();
    return Result.ok(undefined);
  }
}
```

#### Step 2: Update Database Schema

```prisma
// prisma/schema.prisma

model Workflow {
  id          String   @id @default(cuid())
  name        String
  description String?  @db.Text  // ← Add this
  userId      String
  // ... rest of fields
}
```

```bash
# Create migration
pnpm db:migrate
# Name it: "add_workflow_description"
```

#### Step 3: Update Repository Mapper

```typescript
// src/features/workflows/infrastructure/mappers/workflow.mapper.ts

static toDomain(prismaWorkflow: PrismaWorkflow & {...}): Workflow {
  const workflowResult = Workflow.create({
    name: prismaWorkflow.name,
    description: prismaWorkflow.description ?? undefined,  // ← Add this
    userId: prismaWorkflow.userId,
    // ... rest
  }, ID.create(prismaWorkflow.id));
  // ...
}

static toPrismaCreate(workflow: Workflow): {...} {
  return {
    id: workflow.id.getValue(),
    name: workflow.name,
    description: workflow.description ?? null,  // ← Add this
    userId: workflow.userId,
    // ... rest
  };
}
```

#### Step 4: Update Use Case (Optional)

```typescript
// src/features/workflows/application/use-cases/create-workflow.use-case.ts

export interface CreateWorkflowInput {
  name: string;
  description?: string; // ← Add this
  userId: string;
}

// In execute method:
const workflowResult = Workflow.create({
  name: input.name,
  description: input.description, // ← Add this
  userId: input.userId,
  nodes: [],
  edges: [],
});
```

#### Step 5: Update API Input Schema

```typescript
// src/trpc/schemas.ts or in the router file

const createWorkflowSchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().max(500).optional(), // ← Add this
});
```

#### Step 6: Update UI Component

```tsx
// src/app/(dashboard)/workflows/page.tsx or relevant component

<input type="text" name="description" placeholder="Describe your workflow..." className="..." />
```

#### Step 7: Write Tests

```typescript
// tests/unit/workflows/workflow.entity.test.ts

describe('Workflow description', () => {
  it('should update description', () => {
    const workflowResult = Workflow.create({
      name: 'Test',
      userId: 'user-123',
      nodes: [],
      edges: [],
    });

    const workflow = workflowResult.data!;
    const result = workflow.updateDescription('My workflow description');

    expect(result.success).toBe(true);
    expect(workflow.description).toBe('My workflow description');
  });

  it('should fail with description too long', () => {
    const workflow = Workflow.create({...}).data!;
    const result = workflow.updateDescription('a'.repeat(501));

    expect(result.success).toBe(false);
    expect(result.error).toContain('500 characters');
  });
});
```

#### Step 8: Run Tests

```bash
pnpm test
```

✅ **Done! You've added a feature following Clean Architecture!**

---

## 🛠️ Common Tasks

### Adding a New Entity

```bash
# 1. Create entity file
touch src/features/my-feature/domain/entities/my-entity.entity.ts

# 2. Create repository interface
touch src/features/my-feature/domain/repositories/my-entity.repository.interface.ts

# 3. Create use cases
mkdir -p src/features/my-feature/application/use-cases
touch src/features/my-feature/application/use-cases/create-my-entity.use-case.ts

# 4. Create repository implementation
mkdir -p src/features/my-feature/infrastructure/repositories
touch src/features/my-feature/infrastructure/repositories/prisma-my-entity.repository.ts

# 5. Create API router
mkdir -p src/features/my-feature/api
touch src/features/my-feature/api/my-entity.router.ts

# 6. Create test
mkdir -p tests/unit/my-feature
touch tests/unit/my-feature/my-entity.entity.test.ts
```

### Adding a New API Endpoint

```typescript
// src/features/workflows/api/workflows.router.ts

export const workflowsRouter = createTRPCRouter({
  // ... existing endpoints

  // Add new endpoint
  archive: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const repository = new PrismaWorkflowRepository();
      const useCase = new ArchiveWorkflowUseCase(repository);

      const result = await useCase.execute({
        id: input.id,
        userId: ctx.userId!,
      });

      if (!result.success) {
        throw new Error(result.error);
      }

      return ok({
        data: result.data,
        message: 'Workflow archived',
      });
    }),
});
```

### Debugging Database Queries

```typescript
// Enable Prisma query logging
// Add to .env.local:
DEBUG=prisma:query

// Or programmatically:
const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
});
```

### Running Database Migrations

```bash
# Create new migration
pnpm db:migrate
# Enter migration name when prompted

# Reset database (CAUTION: Deletes all data)
pnpm db:reset

# Deploy migrations (production)
pnpm db:deploy

# Push schema without migration (dev only)
pnpm db:push
```

### Working with Background Jobs

```typescript
// src/inngest/functions.ts

export const myBackgroundJob = inngest.createFunction(
  { id: 'my-background-job' },
  { event: 'workflow/created' },
  async ({ event, step }) => {
    // Step 1: Do something
    await step.run('process-workflow', async () => {
      // Your logic here
    });

    // Step 2: Do something else
    await step.run('send-notification', async () => {
      // Your logic here
    });
  }
);

// Trigger from use case:
await inngest.send({
  name: 'workflow/created',
  data: {
    workflowId: workflow.id.getValue(),
    userId: input.userId,
  },
});
```

---

## 🧰 Useful Scripts & Utils

### Database Scripts

```bash
# View database in browser
pnpm db:studio

# Generate Prisma Client (after schema changes)
pnpm db:generate

# Create migration
pnpm db:migrate

# Reset database
pnpm db:reset

# Seed database with test data
pnpm db:seed
```

### Testing Scripts

```bash
# Run all tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Run tests with coverage
pnpm test:coverage

# Run tests with UI
pnpm test:ui

# Run E2E tests
pnpm e2e

# Run E2E with visible browser
pnpm e2e:headed

# Debug E2E tests
pnpm e2e:debug
```

### Development Scripts

```bash
# Start all services
pnpm dev:all

# Start Next.js only
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start

# Lint code
pnpm lint

# Format code
pnpm format

# Check formatting
pnpm format:check
```

### Custom Scripts

```typescript
// scripts/check-connections.ts
// Check database connections for validity

import { prisma } from '../src/shared/infrastructure/database/prisma.client';

async function checkConnections() {
  const connections = await prisma.connection.findMany();
  console.log(`Found ${connections.length} connections`);
  // ... validation logic
}
```

Run with:

```bash
npx tsx scripts/check-connections.ts
```

### Useful Utilities

#### 1. **Result Type** (`src/core/types/common.types.ts`)

```typescript
// Instead of throwing errors:
const result = someOperation();

if (result.success) {
  console.log(result.data);
} else {
  console.error(result.error);
}
```

#### 2. **ID Generation** (`src/shared/domain/value-objects/id.vo.ts`)

```typescript
import { ID } from '@/shared/domain/value-objects/id.vo';

const id = ID.generate();
console.log(id.getValue()); // "cm3x..."
```

#### 3. **Logger** (`src/shared/infrastructure/logger/pino.logger.ts`)

```typescript
import { logger } from '@/shared/infrastructure/logger/pino.logger';

logger.info('User created workflow', { userId, workflowId });
logger.error('Failed to save', { error });
logger.debug('Processing node', { nodeId, nodeType });
```

#### 4. **Class Names** (`src/shared/ui/utils/utils.ts`)

```typescript
import { cn } from '@/lib/utils';

<div className={cn(
  'base-class',
  isActive && 'active-class',
  className
)} />
```

#### 5. **Audit Logging** (`src/shared/application/services/audit.ts`)

```typescript
import { auditWorkflowCreate } from '@/lib/audit';

await auditWorkflowCreate(workflowId, userId, {
  workflowName: 'My Workflow',
  requestId: ctx.requestId,
});
```

---

## 🐛 Debugging Tips

### 1. Check Logs

```bash
# Development logs in terminal
# Look for errors with [ERROR] prefix

# Structured logging
logger.debug('Debug info', { userId, workflowId });
```

### 2. Use Prisma Studio

```bash
pnpm db:studio
# Opens http://localhost:5555
# Visual interface to browse/edit database
```

### 3. Enable Verbose Logging

```env
# .env.local
LOG_LEVEL=debug
DEBUG=prisma:query
```

### 4. Use React DevTools

```bash
# Install Chrome extension
# https://chrome.google.com/webstore/detail/react-developer-tools
```

### 5. Debug tRPC Calls

```typescript
// In browser console:
// Check network tab for /api/trpc/* requests

// In code:
const utils = api.useUtils();
console.log(utils);
```

### 6. Debug Tests

```bash
# Run single test file
pnpm test tests/unit/workflows/workflow.entity.test.ts

# Run with debugging
node --inspect-brk node_modules/.bin/vitest

# Use console.log in tests
it('should work', () => {
  console.log('Debug:', someValue);
  expect(someValue).toBe(expected);
});
```

### 7. Common Issues

**Issue: Module not found `@/lib/utils`**

```bash
# Solution: Rebuild
rm -rf .next
pnpm dev
```

**Issue: Prisma Client out of sync**

```bash
# Solution: Regenerate
pnpm db:generate
```

**Issue: Port 3000 already in use**

```bash
# Solution: Kill process
lsof -ti:3000 | xargs kill -9
```

**Issue: TypeScript errors**

```bash
# Check errors
npx tsc --noEmit

# Fix imports
# Ensure paths in tsconfig.json are correct
```

---

## ✅ Best Practices

### 1. Always Use Result Type

```typescript
// ❌ Bad
function createWorkflow(name: string): Workflow {
  if (!name) throw new Error('Name required');
  return new Workflow(name);
}

// ✅ Good
function createWorkflow(name: string): Result<Workflow, string> {
  if (!name) return Result.fail('Name required');
  return Result.ok(new Workflow(name));
}
```

### 2. Keep Domain Pure

```typescript
// ❌ Bad: Domain depends on infrastructure
import { prisma } from '@/lib/db';

export class Workflow {
  async save() {
    await prisma.workflow.create({...});
  }
}

// ✅ Good: Domain is pure
export class Workflow {
  // No external dependencies
  // Just business logic
}
```

### 3. Use Interfaces for Dependencies

```typescript
// ❌ Bad: Direct dependency
export class CreateWorkflowUseCase {
  async execute() {
    const prisma = new PrismaClient();
    await prisma.workflow.create({...});
  }
}

// ✅ Good: Depend on interface
export class CreateWorkflowUseCase {
  constructor(
    private repository: IWorkflowRepository
  ) {}

  async execute() {
    await this.repository.create(workflow);
  }
}
```

### 4. Write Tests First (TDD)

```typescript
// 1. Write test
it('should add node to workflow', () => {
  const workflow = createWorkflow();
  const node = createNode();

  const result = workflow.addNode(node);

  expect(result.success).toBe(true);
  expect(workflow.nodes).toHaveLength(1);
});

// 2. Implement feature
public addNode(node: Node): Result<void, string> {
  this.props.nodes.push(node);
  return Result.ok(undefined);
}

// 3. Refactor if needed
```

### 5. Use Descriptive Names

```typescript
// ❌ Bad
const d = new Date();
const w = Workflow.create({...});
function proc(x: any) { ... }

// ✅ Good
const createdAt = new Date();
const workflowResult = Workflow.create({...});
function processWorkflowExecution(execution: Execution) { ... }
```

### 6. Follow Git Commit Conventions

```bash
# Format: <type>: <description>

git commit -m "feat: add workflow description field"
git commit -m "fix: resolve edge validation issue"
git commit -m "docs: update architecture guide"
git commit -m "refactor: extract node validation logic"
git commit -m "test: add workflow entity tests"
git commit -m "chore: update dependencies"
```

### 7. Keep Functions Small

```typescript
// ❌ Bad: One giant function
async function createWorkflow(input) {
  // 100 lines of code...
}

// ✅ Good: Break into smaller functions
async function createWorkflow(input) {
  const workflow = await buildWorkflow(input);
  const initialNode = createInitialNode(workflow.id);
  await persistWorkflow(workflow);
  await sendNotification(workflow);
  return workflow;
}
```

---

## 🎓 Learning Resources

### Clean Architecture

- [The Clean Architecture by Uncle Bob](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
- [Domain-Driven Design Quickly (Free PDF)](https://www.infoq.com/minibooks/domain-driven-design-quickly/)

### TypeScript

- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)
- [TypeScript Deep Dive](https://basarat.gitbook.io/typescript/)

### Next.js

- [Next.js 15 Documentation](https://nextjs.org/docs)
- [Next.js App Router Guide](https://nextjs.org/docs/app)

### Testing

- [Vitest Documentation](https://vitest.dev/)
- [Playwright Documentation](https://playwright.dev/)
- [Testing Library](https://testing-library.com/docs/react-testing-library/intro/)

---

## 🚀 Your Learning Path

### Week 1: Environment & Architecture

- ✅ Set up development environment
- ✅ Run the project successfully
- ✅ Understand the folder structure
- ✅ Read ARCHITECTURE.md

### Week 2: Read & Explore

- ✅ Read existing features (workflows, auth)
- ✅ Understand data flow
- ✅ Run tests successfully
- ✅ Make a small UI change

### Week 3: First Feature

- ✅ Add a simple field to an entity
- ✅ Write tests for it
- ✅ Create a PR

### Week 4: Advanced Topics

- ✅ Create a new entity from scratch
- ✅ Add background job
- ✅ Write E2E test

**Welcome to the team! 🎉**
