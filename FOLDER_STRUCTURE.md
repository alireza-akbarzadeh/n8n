# 📂 Complete Folder Structure with Explanations

Visual guide to every important file and folder in the project.

---

## 🌳 Complete Directory Tree

```
n8n/
│
├── 📄 README.md                      ← Start here! Project overview
├── 📄 ARCHITECTURE.md                ← System architecture & diagrams
├── 📄 DEVELOPER_GUIDE.md             ← Complete developer onboarding
├── 📄 SCRIPTS_AND_UTILS.md           ← All scripts & utilities reference
│
├── 📦 package.json                   ← Dependencies & scripts
├── 📦 pnpm-lock.yaml                 ← Lock file for reproducible installs
│
├── ⚙️ Configuration Files
│   ├── .env.example                  ← Environment variables template
│   ├── next.config.ts                ← Next.js configuration
│   ├── tsconfig.json                 ← TypeScript configuration
│   ├── vitest.config.ts              ← Unit test configuration
│   ├── playwright.config.ts          ← E2E test configuration
│   ├── eslint.config.mjs             ← Linting rules
│   ├── prettier.config.js            ← Code formatting rules
│   ├── tailwind.config.ts            ← Tailwind CSS configuration
│   ├── postcss.config.mjs            ← PostCSS configuration
│   ├── components.json               ← shadcn/ui configuration
│   ├── mprocs.yaml                   ← Multi-process runner config
│   ├── .gitignore                    ← Git ignore patterns
│   └── .husky/                       ← Git hooks (pre-commit, etc.)
│
├── 🗃️ prisma/                        ← Database layer
│   ├── schema.prisma                 ← Database schema definition
│   ├── seed.ts                       ← Seed data script
│   ├── prisma.config.ts              ← Prisma configuration
│   ├── migrations/                   ← Database migration history
│   │   ├── 20231101_init/
│   │   ├── 20231102_add_workflows/
│   │   └── migration_lock.toml
│   └── generated/                    ← Generated Prisma Client
│       └── prisma/client/
│
├── 🎨 public/                        ← Static assets (served at /)
│   ├── icons/                        ← App icons
│   │   ├── favicon.ico
│   │   └── logo.svg
│   └── images/                       ← Static images
│       └── hero.png
│
├── 📝 scripts/                       ← Utility scripts
│   ├── check-connections.ts          ← Validate DB connections
│   └── google-form-trigger-scripts.ts ← Google Forms integration
│
├── 🧪 tests/                         ← All test files
│   ├── unit/                         ← Unit tests (fast, isolated)
│   │   ├── example.test.ts
│   │   ├── health-check.test.ts
│   │   ├── workflows/
│   │   │   ├── workflow.entity.test.ts
│   │   │   ├── node.entity.test.ts
│   │   │   └── edge.entity.test.ts
│   │   ├── auth/
│   │   │   └── user.entity.test.ts
│   │   └── executions/
│   │       └── execution.entity.test.ts
│   │
│   ├── integration/                  ← Integration tests (with DB)
│   │   ├── repositories/
│   │   └── api/
│   │
│   └── e2e/                          ← End-to-end tests (Playwright)
│       ├── auth.spec.ts
│       ├── workflows.spec.ts
│       └── editor.spec.ts
│
└── 📂 src/                           ← Main source code
    │
    ├── 🎨 app/                       ← Next.js App Router (Pages & Layouts)
    │   ├── layout.tsx                ← Root layout
    │   ├── globals.css               ← Global styles
    │   ├── global-error.tsx          ← Global error boundary
    │   │
    │   ├── (auth)/                   ← Auth route group
    │   │   ├── layout.tsx            ← Auth layout (centered, no sidebar)
    │   │   ├── login/
    │   │   │   └── page.tsx          ← Login page
    │   │   ├── signup/
    │   │   │   └── page.tsx          ← Signup page
    │   │   └── verify-email/
    │   │       └── page.tsx          ← Email verification
    │   │
    │   ├── (dashboard)/              ← Dashboard route group (protected)
    │   │   ├── layout.tsx            ← Dashboard layout (sidebar, header)
    │   │   │
    │   │   ├── (editor)/             ← Editor sub-group
    │   │   │   └── editor/
    │   │   │       └── [id]/
    │   │   │           └── page.tsx  ← Workflow editor (/editor/123)
    │   │   │
    │   │   └── (rest)/               ← Other dashboard pages
    │   │       ├── workflows/
    │   │       │   └── page.tsx      ← Workflows list
    │   │       ├── executions/
    │   │       │   └── page.tsx      ← Executions list
    │   │       └── settings/
    │   │           └── page.tsx      ← Settings
    │   │
    │   └── api/                      ← API routes
    │       ├── auth/
    │       │   └── [...all]/
    │       │       └── route.ts      ← Better Auth endpoints
    │       ├── inngest/
    │       │   └── route.ts          ← Inngest webhook
    │       └── trpc/
    │           └── [trpc]/
    │               └── route.ts      ← tRPC endpoint
    │
    ├── ⚙️ core/                      ← Core configuration & types
    │   ├── index.ts
    │   ├── api/
    │   │   └── middleware.ts         ← API middleware
    │   ├── auth/
    │   │   ├── auth.ts               ← Better Auth config
    │   │   └── auth-client.ts        ← Auth client (frontend)
    │   ├── config/
    │   │   └── constants.ts          ← App constants
    │   └── types/
    │       └── common.types.ts       ← Shared types (Result, etc.)
    │
    ├── 📦 features/                  ← Feature modules (Clean Architecture)
    │   │
    │   ├── 🔄 workflows/             ← Workflows feature
    │   │   ├── README.md             ← Feature documentation
    │   │   ├── index.ts              ← Public exports
    │   │   │
    │   │   ├── domain/               ← 💎 DOMAIN LAYER (Pure business logic)
    │   │   │   ├── entities/         ← Business entities
    │   │   │   │   ├── workflow.entity.ts    ← Workflow aggregate root
    │   │   │   │   ├── node.entity.ts        ← Node entity
    │   │   │   │   └── edge.entity.ts        ← Edge entity
    │   │   │   │
    │   │   │   └── repositories/     ← Repository interfaces (contracts)
    │   │   │       └── workflow.repository.interface.ts
    │   │   │
    │   │   ├── application/          ← 🎯 APPLICATION LAYER (Use cases)
    │   │   │   ├── use-cases/        ← Business operations
    │   │   │   │   ├── create-workflow.use-case.ts
    │   │   │   │   ├── get-workflow.use-case.ts
    │   │   │   │   ├── list-workflows.use-case.ts
    │   │   │   │   ├── update-workflow.use-case.ts
    │   │   │   │   ├── update-workflow-name.use-case.ts
    │   │   │   │   └── delete-workflow.use-case.ts
    │   │   │   │
    │   │   │   └── mappers/          ← Entity ↔ Persistence mappers
    │   │   │       └── workflow.mapper.ts
    │   │   │
    │   │   ├── infrastructure/       ← 🔧 INFRASTRUCTURE LAYER (Implementations)
    │   │   │   └── repositories/     ← Repository implementations
    │   │   │       └── prisma-workflow.repository.ts
    │   │   │
    │   │   ├── api/                  ← 🔌 API LAYER (tRPC routers)
    │   │   │   └── workflows.router.ts
    │   │   │
    │   │   ├── presentation/         ← 🎨 PRESENTATION (Pages)
    │   │   │   └── pages/
    │   │   │       ├── workflows-page.tsx
    │   │   │       └── editor-page.tsx
    │   │   │
    │   │   └── ui/                   ← 🧩 UI LAYER (Components)
    │   │       ├── components/
    │   │       │   ├── workflow-list.tsx
    │   │       │   ├── workflow-card.tsx
    │   │       │   └── workflow-editor.tsx
    │   │       └── hooks/
    │   │           └── use-workflow.ts
    │   │
    │   ├── 🔐 auth/                  ← Authentication feature
    │   │   ├── domain/
    │   │   │   ├── entities/
    │   │   │   │   └── user.entity.ts
    │   │   │   └── repositories/
    │   │   │       └── user.repository.interface.ts
    │   │   ├── application/
    │   │   │   └── use-cases/
    │   │   │       ├── register-user.use-case.ts
    │   │   │       └── verify-email.use-case.ts
    │   │   ├── infrastructure/
    │   │   │   └── repositories/
    │   │   │       └── prisma-user.repository.ts
    │   │   ├── api/
    │   │   │   └── auth.router.ts
    │   │   └── presentation/
    │   │       └── components/
    │   │           ├── login-form.tsx
    │   │           └── signup-form.tsx
    │   │
    │   ├── ▶️ executions/            ← Execution tracking feature
    │   │   ├── domain/
    │   │   │   ├── entities/
    │   │   │   │   └── execution.entity.ts
    │   │   │   └── repositories/
    │   │   ├── application/
    │   │   ├── infrastructure/
    │   │   ├── api/
    │   │   └── ui/
    │   │
    │   ├── 🎯 triggers/              ← Trigger management feature
    │   │   ├── domain/
    │   │   ├── application/
    │   │   ├── infrastructure/
    │   │   ├── api/
    │   │   └── ui/
    │   │
    │   ├── 🔑 credentials/           ← Credential storage feature
    │   │   ├── domain/
    │   │   ├── application/
    │   │   ├── infrastructure/
    │   │   ├── api/
    │   │   └── ui/
    │   │
    │   ├── 🪝 webhooks/              ← Webhook management feature
    │   │   └── api/
    │   │
    │   ├── 💳 subscriptions/         ← Subscription management
    │   │   └── api/
    │   │
    │   └── 🏠 home/                  ← Home/dashboard feature
    │       └── ui/
    │
    ├── 🌐 shared/                    ← Shared code (used by all features)
    │   │
    │   ├── domain/                   ← Shared domain concepts
    │   │   ├── entities/
    │   │   │   └── base.entity.ts    ← Base entity class
    │   │   └── value-objects/
    │   │       ├── id.vo.ts          ← ID value object
    │   │       └── email.vo.ts       ← Email value object
    │   │
    │   ├── application/              ← Shared application services
    │   │   └── services/
    │   │       └── audit.ts          ← Audit logging service
    │   │
    │   ├── infrastructure/           ← Shared infrastructure
    │   │   ├── database/
    │   │   │   ├── db.ts             ← Database client export
    │   │   │   └── prisma.client.ts  ← Prisma client singleton
    │   │   ├── logger/
    │   │   │   └── pino.logger.ts    ← Structured logging
    │   │   └── encryption/
    │   │       └── crypto.ts         ← Encryption utilities
    │   │
    │   └── ui/                       ← Shared UI utilities
    │       └── utils/
    │           └── utils.ts          ← UI helpers (cn(), etc.)
    │
    ├── 🧩 components/                ← Shared React components
    │   ├── app-header.tsx            ← App header
    │   ├── app-sidebar.tsx           ← App sidebar
    │   ├── add-node-button.tsx       ← Add node button
    │   ├── node-selector.tsx         ← Node type selector
    │   ├── upgrade-modal.tsx         ← Upgrade modal
    │   ├── workflow-node.tsx         ← Workflow node component
    │   │
    │   ├── ui/                       ← Base UI components (Radix UI)
    │   │   ├── button.tsx
    │   │   ├── dialog.tsx
    │   │   ├── input.tsx
    │   │   ├── card.tsx
    │   │   ├── dropdown-menu.tsx
    │   │   ├── form.tsx
    │   │   ├── label.tsx
    │   │   ├── select.tsx
    │   │   ├── toast.tsx
    │   │   ├── tooltip.tsx
    │   │   └── [50+ more components]
    │   │
    │   ├── react-flow/               ← React Flow custom components
    │   │   ├── base-node.tsx
    │   │   ├── base-handle.tsx
    │   │   ├── button-edge.tsx
    │   │   ├── animate-edge.tsx
    │   │   ├── placeholder-node.tsx
    │   │   ├── node-status-indicator.tsx
    │   │   └── edge-node-data.tsx
    │   │
    │   └── entities/                 ← Generic entity components
    │       ├── entity-view.tsx       ← Generic list view
    │       ├── entity-item.tsx       ← Generic list item
    │       ├── entity-header.tsx     ← Generic header
    │       ├── entity-search.tsx     ← Generic search
    │       ├── entity-pagination.tsx ← Generic pagination
    │       ├── entity-states.tsx     ← Loading/empty states
    │       └── entity-containers.tsx ← Layout containers
    │
    ├── 🔄 inngest/                   ← Background jobs (Inngest)
    │   ├── client.ts                 ← Inngest client setup
    │   └── functions.ts              ← Job definitions
    │       ├── executeWorkflow       ← Workflow execution job
    │       ├── sendNotification      ← Notification job
    │       └── cleanupOldData        ← Cleanup job
    │
    ├── 🔌 trpc/                      ← tRPC configuration
    │   ├── init.ts                   ← tRPC setup (context, middleware)
    │   ├── client.tsx                ← Client-side tRPC setup
    │   ├── server.tsx                ← Server-side tRPC setup
    │   ├── query-client.ts           ← React Query configuration
    │   ├── schemas.ts                ← Shared Zod schemas
    │   └── routers/
    │       └── index.ts              ← Router aggregation
    │
    ├── 📁 config/                    ← Configuration files
    │   ├── constants.ts              ← App-wide constants
    │   └── node-components.ts        ← Node type configurations
    │
    ├── 🪝 hooks/                     ← Shared React hooks
    │   ├── use-mobile.ts             ← Mobile detection
    │   ├── use-upgrade-modal.tsx     ← Upgrade modal logic
    │   └── use-entity-search.tsx     ← Generic search hook
    │
    ├── 🎭 actions/                   ← Server actions
    │   └── auth.ts                   ← Auth server actions
    │
    ├── 🧰 lib/                       ← Library re-exports (convenience)
    │   ├── utils.ts                  ← Re-export from shared/ui/utils
    │   ├── db.ts                     ← Re-export from shared/infrastructure
    │   ├── auth.ts                   ← Re-export from core/auth
    │   └── logger.ts                 ← Re-export from shared/infrastructure
    │
    ├── 🎨 styles/                    ← Additional styles (if needed)
    │
    └── 📝 types/                     ← Global type declarations
        ├── index.ts
        └── css.d.ts                  ← CSS module types
```

---

## 🎯 Key Directories Explained

### 📦 `src/features/` - Feature Modules

Each feature is **self-contained** and follows **Clean Architecture**:

```
feature/
├── domain/              ← 💎 Pure business logic (NO dependencies)
│   ├── entities/        ← Business entities with rules
│   └── repositories/    ← Interface definitions only
│
├── application/         ← 🎯 Use cases (orchestration)
│   ├── use-cases/       ← Business operations
│   └── mappers/         ← Data transformation
│
├── infrastructure/      ← 🔧 External implementations
│   └── repositories/    ← Prisma implementations
│
├── api/                 ← 🔌 API endpoints (tRPC)
│
├── presentation/        ← 🎨 Page components
│
└── ui/                  ← 🧩 UI components & hooks
```

**Example: Workflows Feature**

```
workflows/
├── domain/entities/workflow.entity.ts     ← Business rules
├── application/use-cases/create.ts        ← Create workflow logic
├── infrastructure/repositories/prisma.ts  ← Database implementation
├── api/workflows.router.ts                ← API endpoints
└── ui/components/workflow-list.tsx        ← UI component
```

---

### 🌐 `src/shared/` - Shared Across Features

```
shared/
├── domain/                  ← Base classes for all features
│   ├── entities/
│   │   └── base.entity.ts   ← All entities extend this
│   └── value-objects/
│       └── id.vo.ts         ← All entities use this for IDs
│
├── application/             ← Shared services
│   └── services/
│       └── audit.ts         ← Used by all features for logging
│
├── infrastructure/          ← Shared infrastructure
│   ├── database/
│   │   └── prisma.client.ts ← Database connection (singleton)
│   ├── logger/
│   │   └── pino.logger.ts   ← Logging (all features use this)
│   └── encryption/
│       └── crypto.ts        ← Encryption (credentials, etc.)
│
└── ui/                      ← Shared UI utilities
    └── utils/
        └── utils.ts         ← cn(), formatDate(), etc.
```

---

### 🧩 `src/components/` - Reusable UI Components

```
components/
├── ui/                      ← Base components (Radix UI)
│   ├── button.tsx           ← Used everywhere
│   ├── dialog.tsx           ← Modal dialogs
│   ├── input.tsx            ← Form inputs
│   └── [50+ more]
│
├── react-flow/              ← Workflow editor components
│   ├── base-node.tsx        ← Custom node rendering
│   ├── base-handle.tsx      ← Connection points
│   └── button-edge.tsx      ← Custom edges
│
└── entities/                ← Generic CRUD components
    ├── entity-view.tsx      ← List view template
    ├── entity-item.tsx      ← List item template
    └── entity-pagination.tsx ← Pagination template
```

**Usage Example:**

```tsx
// Any feature can use these
import { Button } from '@/components/ui/button';
import { EntityView } from '@/components/entities/entity-view';
import { BaseNode } from '@/components/react-flow/base-node';
```

---

### 🔌 `src/trpc/` - API Configuration

```
trpc/
├── init.ts                  ← tRPC setup
│   ├── createContext()      ← Request context (userId, etc.)
│   ├── publicProcedure      ← Anyone can call
│   ├── protectedProcedure   ← Requires auth
│   └── premiumProcedure     ← Requires subscription
│
├── routers/
│   └── index.ts             ← Combines all feature routers
│       └── appRouter
│           ├── workflows    ← from workflows.router.ts
│           ├── auth         ← from auth.router.ts
│           ├── executions   ← from executions.router.ts
│           └── triggers     ← from triggers.router.ts
│
├── client.tsx               ← Client-side setup (React)
├── server.tsx               ← Server-side setup (RSC)
└── schemas.ts               ← Shared Zod validation schemas
```

---

### 🔄 `src/inngest/` - Background Jobs

```
inngest/
├── client.ts                ← Inngest client configuration
└── functions.ts             ← Job definitions
    ├── executeWorkflow      ← Long-running workflow execution
    ├── sendEmail            ← Email notifications
    ├── processWebhook       ← Webhook processing
    └── cleanupOldData       ← Scheduled cleanup
```

**Job Example:**

```typescript
export const executeWorkflow = inngest.createFunction(
  { id: 'execute-workflow' },
  { event: 'workflow/execute' },
  async ({ event }) => {
    // Step-by-step execution
  }
);
```

---

### 🎨 `src/app/` - Next.js Pages

```
app/
├── layout.tsx               ← Root layout (wraps everything)
│   └── Providers            ← React Query, Theme, etc.
│
├── (auth)/                  ← Public auth pages
│   ├── layout.tsx           ← Auth layout (centered)
│   ├── login/page.tsx
│   └── signup/page.tsx
│
└── (dashboard)/             ← Protected pages
    ├── layout.tsx           ← Dashboard layout (sidebar + header)
    ├── (editor)/
    │   └── editor/[id]/     ← /editor/123
    │       └── page.tsx
    └── (rest)/
        ├── workflows/       ← /workflows
        │   └── page.tsx
        ├── executions/      ← /executions
        │   └── page.tsx
        └── settings/        ← /settings
            └── page.tsx
```

**Route Groups:**

- `(auth)` - No sidebar, centered layout
- `(dashboard)` - With sidebar and header
- `(editor)` - Full-screen workflow editor
- `(rest)` - Other dashboard pages

---

## 🔑 Important Files

### Configuration

| File                   | Purpose                        |
| ---------------------- | ------------------------------ |
| `package.json`         | Dependencies & scripts         |
| `.env.example`         | Environment variables template |
| `next.config.ts`       | Next.js configuration          |
| `tsconfig.json`        | TypeScript configuration       |
| `prisma/schema.prisma` | Database schema                |
| `vitest.config.ts`     | Test configuration             |
| `mprocs.yaml`          | Multi-process runner           |

### Core Files

| File                                                  | Purpose                   |
| ----------------------------------------------------- | ------------------------- |
| `src/core/types/common.types.ts`                      | Result type, shared types |
| `src/shared/domain/entities/base.entity.ts`           | Base entity class         |
| `src/shared/domain/value-objects/id.vo.ts`            | ID value object           |
| `src/shared/infrastructure/database/prisma.client.ts` | Database client           |
| `src/shared/infrastructure/logger/pino.logger.ts`     | Logger                    |
| `src/trpc/init.ts`                                    | tRPC setup                |
| `src/inngest/client.ts`                               | Background jobs setup     |

### Entry Points

| File                               | Purpose                |
| ---------------------------------- | ---------------------- |
| `src/app/layout.tsx`               | Root layout            |
| `src/app/api/trpc/[trpc]/route.ts` | tRPC HTTP handler      |
| `src/app/api/inngest/route.ts`     | Inngest webhook        |
| `src/trpc/routers/index.ts`        | API router aggregation |

---

## 🎓 Reading Order for New Developers

### Day 1: High-Level Understanding

1. ✅ `README.md` - Project overview
2. ✅ `ARCHITECTURE.md` - System architecture
3. ✅ `src/features/workflows/README.md` - Feature example
4. ✅ `src/shared/domain/entities/base.entity.ts` - Base concepts

### Day 2: Core Concepts

5. ✅ `src/core/types/common.types.ts` - Result pattern
6. ✅ `src/shared/domain/value-objects/id.vo.ts` - Value objects
7. ✅ `src/features/workflows/domain/entities/workflow.entity.ts` - Entity example
8. ✅ `src/features/workflows/application/use-cases/create-workflow.use-case.ts` - Use case example

### Day 3: Infrastructure & API

9. ✅ `src/features/workflows/infrastructure/repositories/prisma-workflow.repository.ts` - Repository
10. ✅ `src/features/workflows/api/workflows.router.ts` - API router
11. ✅ `src/trpc/init.ts` - tRPC setup
12. ✅ `prisma/schema.prisma` - Database schema

### Day 4: UI & Testing

13. ✅ `src/app/(dashboard)/(rest)/workflows/page.tsx` - Page example
14. ✅ `src/features/workflows/ui/components/workflow-list.tsx` - Component example
15. ✅ `tests/unit/workflows/workflow.entity.test.ts` - Test example
16. ✅ `tests/e2e/workflows.spec.ts` - E2E test example

---

## 🚀 Quick Navigation

### I want to...

**Add a new feature:**
→ Create folder in `src/features/my-feature/`
→ See [DEVELOPER_GUIDE.md](./DEVELOPER_GUIDE.md#adding-a-new-feature)

**Add a new API endpoint:**
→ Edit `src/features/{feature}/api/{feature}.router.ts`
→ See [DEVELOPER_GUIDE.md](./DEVELOPER_GUIDE.md#adding-a-new-api-endpoint)

**Add a new UI component:**
→ Create in `src/components/ui/my-component.tsx`

**Add a new page:**
→ Create in `src/app/(dashboard)/(rest)/my-page/page.tsx`

**Add a database table:**
→ Edit `prisma/schema.prisma`
→ Run `pnpm db:migrate`

**Add a background job:**
→ Edit `src/inngest/functions.ts`

**Run tests:**
→ `pnpm test` or `pnpm test:watch`

**View database:**
→ `pnpm db:studio`

**Debug:**
→ See [DEVELOPER_GUIDE.md](./DEVELOPER_GUIDE.md#-debugging-tips)

---

**This is your map! Keep it handy while exploring the codebase. 🗺️**
