# Architecture Visualization

## Clean Architecture Layers

```
┌─────────────────────────────────────────────────────────────────┐
│                        PRESENTATION LAYER                       │
│                                                                 │
│  ┌─────────────┐  ┌──────────────┐  ┌──────────────────────┐  │
│  │  Next.js    │  │    React     │  │      tRPC Client     │  │
│  │  App Router │  │  Components  │  │  (API Communication) │  │
│  └─────────────┘  └──────────────┘  └──────────────────────┘  │
│                                                                 │
│  Location: /app, /src/features/*/ui                            │
└─────────────────────────────────────────────────────────────────┘
                                ↓
┌─────────────────────────────────────────────────────────────────┐
│                       APPLICATION LAYER                         │
│                                                                 │
│  ┌─────────────┐  ┌──────────────┐  ┌──────────────────────┐  │
│  │  Use Cases  │  │     DTOs     │  │       Mappers        │  │
│  │  (Business  │  │  (Data       │  │  (Entity ↔ DTO)      │  │
│  │  Operations)│  │  Transfer)   │  │                      │  │
│  └─────────────┘  └──────────────┘  └──────────────────────┘  │
│                                                                 │
│  Location: /src/features/*/application, /src/features/*/api    │
└─────────────────────────────────────────────────────────────────┘
                                ↓
┌─────────────────────────────────────────────────────────────────┐
│                         DOMAIN LAYER                            │
│                                                                 │
│  ┌─────────────┐  ┌──────────────┐  ┌──────────────────────┐  │
│  │  Entities   │  │    Value     │  │     Repository       │  │
│  │  (Business  │  │   Objects    │  │     Interfaces       │  │
│  │   Models)   │  │  (Immutable) │  │   (Abstractions)     │  │
│  └─────────────┘  └──────────────┘  └──────────────────────┘  │
│                                                                 │
│  Location: /src/features/*/domain, /src/shared/domain          │
└─────────────────────────────────────────────────────────────────┘
                                ↓
┌─────────────────────────────────────────────────────────────────┐
│                      INFRASTRUCTURE LAYER                       │
│                                                                 │
│  ┌─────────────┐  ┌──────────────┐  ┌──────────────────────┐  │
│  │  Database   │  │   External   │  │     File System      │  │
│  │  (Prisma)   │  │     APIs     │  │     Services         │  │
│  │             │  │  (Inngest)   │  │                      │  │
│  └─────────────┘  └──────────────┘  └──────────────────────┘  │
│                                                                 │
│  Location: /src/features/*/infrastructure,                     │
│            /src/shared/infrastructure                          │
└─────────────────────────────────────────────────────────────────┘
```

## Dependency Flow

```
UI Components (React)
        ↓
    tRPC Client
        ↓
    tRPC Router
        ↓
     Use Cases  ←──────┐
        ↓              │
   Domain Entities     │
        ↓              │
  Repository Interface │
        ↓              │
Repository Implementation (Prisma)
```

## Feature Structure Example

```
features/workflows/
│
├── domain/                    # ← Pure Business Logic (No Dependencies)
│   ├── entities/
│   │   ├── workflow.entity.ts       # Rich domain model
│   │   ├── node.entity.ts           # Node entity
│   │   └── edge.entity.ts           # Edge entity
│   ├── repositories/
│   │   └── workflow.repository.interface.ts  # Abstract interface
│   ├── services/
│   │   └── validation.service.ts    # Domain service
│   └── value-objects/
│       └── workflow-name.vo.ts      # Immutable value type
│
├── application/               # ← Application Logic (Depends on Domain)
│   ├── use-cases/
│   │   ├── create-workflow.use-case.ts
│   │   ├── update-workflow.use-case.ts
│   │   └── delete-workflow.use-case.ts
│   ├── dto/
│   │   ├── create-workflow.dto.ts
│   │   └── workflow-response.dto.ts
│   └── mappers/
│       └── workflow.mapper.ts
│
├── infrastructure/            # ← Implementation (Depends on Domain)
│   ├── repositories/
│   │   └── prisma-workflow.repository.ts  # Implements interface
│   └── services/
│       └── inngest-executor.service.ts
│
├── api/                       # ← API Layer (Depends on Application)
│   └── workflows.router.ts    # tRPC router
│
└── ui/                        # ← Presentation (Depends on API)
    ├── components/
    │   ├── workflow-list.tsx
    │   └── workflow-editor.tsx
    └── hooks/
        └── use-workflows.ts
```

## Data Flow Example: Create Workflow

```
┌──────────────────────────────────────────────────────────────────┐
│ 1. User clicks "Create Workflow" button                         │
│    Location: UI Component                                        │
└──────────────────────────────────────────────────────────────────┘
                            ↓
┌──────────────────────────────────────────────────────────────────┐
│ 2. Call tRPC mutation                                            │
│    workflows.create.mutate({ name: "My Workflow" })             │
│    Location: React Hook (use-workflows.ts)                       │
└──────────────────────────────────────────────────────────────────┘
                            ↓
┌──────────────────────────────────────────────────────────────────┐
│ 3. tRPC Router receives request                                 │
│    Validates input with Zod schema                              │
│    Location: workflows.router.ts                                 │
└──────────────────────────────────────────────────────────────────┘
                            ↓
┌──────────────────────────────────────────────────────────────────┐
│ 4. Use Case executes business logic                             │
│    const workflow = Workflow.create(input.name)                 │
│    await repository.save(workflow)                              │
│    Location: create-workflow.use-case.ts                         │
└──────────────────────────────────────────────────────────────────┘
                            ↓
┌──────────────────────────────────────────────────────────────────┐
│ 5. Repository saves to database                                 │
│    await prisma.workflow.create({ data: ... })                  │
│    Location: prisma-workflow.repository.ts                       │
└──────────────────────────────────────────────────────────────────┘
                            ↓
┌──────────────────────────────────────────────────────────────────┐
│ 6. Response flows back up                                       │
│    Repository → Use Case → Router → Hook → UI                   │
│    UI updates with new workflow                                  │
└──────────────────────────────────────────────────────────────────┘
```

## Folder Structure Overview

```
n8n/
├── src/                           # ← NEW: Refactored code
│   ├── core/                      # Framework configuration
│   │   ├── api/                   # tRPC, REST setup
│   │   ├── auth/                  # Auth configuration
│   │   ├── config/                # Env, constants
│   │   └── types/                 # Common types
│   │
│   ├── features/                  # Domain features
│   │   ├── workflows/             # Workflow feature
│   │   ├── auth/                  # Authentication
│   │   ├── executions/            # Execution engine
│   │   ├── credentials/           # Credential management
│   │   ├── webhooks/              # Webhook handling
│   │   ├── triggers/              # Workflow triggers
│   │   └── subscriptions/         # User subscriptions
│   │
│   └── shared/                    # Shared code
│       ├── domain/                # Base entities, VOs
│       ├── infrastructure/        # DB, logger, cache
│       ├── application/           # Middleware, services
│       └── ui/                    # Shared components
│
├── app/                           # Next.js App Router (unchanged)
├── prisma/                        # Database (unchanged)
├── lib/                           # ← OLD: To be deprecated
├── modules/                       # ← OLD: To be migrated
├── components/                    # ← PARTIAL: Some will move to shared
└── trpc/                          # ← OLD: To be moved to core
```

## Benefits Visualization

```
┌─────────────────────────────────────────────────────────────────┐
│                      MAINTAINABILITY                            │
│                                                                 │
│  ✓ Clear separation of concerns                                │
│  ✓ Easy to find code                                           │
│  ✓ Consistent structure across features                        │
│  ✓ Self-documenting organization                               │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                        SCALABILITY                              │
│                                                                 │
│  ✓ Add features without affecting others                       │
│  ✓ Team can work independently on features                     │
│  ✓ Easy to split into microservices                            │
│  ✓ Vertical slices enable parallel development                 │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                       TESTABILITY                               │
│                                                                 │
│  ✓ Each layer can be tested independently                      │
│  ✓ Easy to mock dependencies                                   │
│  ✓ Clear interfaces for testing                                │
│  ✓ Unit, integration, and E2E tests well-defined               │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                       FLEXIBILITY                               │
│                                                                 │
│  ✓ Swap implementations easily                                 │
│  ✓ Change UI without touching business logic                   │
│  ✓ Switch databases without rewriting logic                    │
│  ✓ Framework independence                                      │
└─────────────────────────────────────────────────────────────────┘
```

## Testing Strategy

```
┌──────────────────────────────────────────────────────────────┐
│                        UNIT TESTS                            │
│                                                              │
│  Domain Layer:                                               │
│    • Test entities (business logic)                          │
│    • Test value objects (validation)                         │
│    • Test domain services                                    │
│                                                              │
│  Application Layer:                                          │
│    • Test use cases with mocked repositories                 │
│    • Test mappers                                            │
│    • Test DTOs                                               │
└──────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────┐
│                     INTEGRATION TESTS                        │
│                                                              │
│  Infrastructure Layer:                                       │
│    • Test repositories with test database                    │
│    • Test external service integrations                      │
│                                                              │
│  API Layer:                                                  │
│    • Test tRPC routers end-to-end                           │
│    • Test authentication and authorization                   │
└──────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────┐
│                      E2E TESTS                               │
│                                                              │
│  UI Layer:                                                   │
│    • Test user flows with Playwright                         │
│    • Test component interactions                             │
│    • Test full workflows                                     │
└──────────────────────────────────────────────────────────────┘
```
