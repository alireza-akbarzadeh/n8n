# Scripts

This folder contains utility scripts for development and maintenance tasks.

## Available Scripts

### 1. Generate Feature

Creates a complete feature folder structure following Clean Architecture principles.

**Usage:**

```bash
pnpm run generate-feature <feature-name>
```

**Example:**

```bash
pnpm run generate-feature billing
```

**What it creates:**

```
src/features/<feature-name>/
├── index.ts                      # Main feature export
├── api/                          # tRPC routers and API endpoints
│   └── index.ts
├── application/                  # Use cases and DTOs
│   ├── index.ts
│   ├── use-cases/
│   │   └── index.ts
│   └── dto/
│       └── index.ts
├── domain/                       # Entities, repositories, and business logic
│   ├── index.ts
│   ├── entities/
│   │   └── index.ts
│   ├── repositories/
│   │   └── index.ts
│   └── services/
│       └── index.ts
├── infrastructure/               # Implementations (mappers, repositories, services)
│   ├── index.ts
│   ├── mappers/
│   │   └── index.ts
│   ├── repositories/
│   │   └── index.ts
│   └── services/
│       └── index.ts
└── presentation/                 # UI components, hooks, and containers
    ├── index.ts
    ├── ui/
    │   └── index.ts
    ├── hooks/
    │   └── index.ts
    └── containers/
        └── index.ts
```

**Development Workflow:**

1. Define Domain Entities in `domain/entities/`
2. Define Repository Interfaces in `domain/repositories/`
3. Create Use Cases in `application/use-cases/`
4. Implement Repositories in `infrastructure/repositories/`
5. Create Mappers in `infrastructure/mappers/`
6. Add UI Components in `presentation/ui/`
7. Create API Routes in `api/`

---

### 2. Check Connections

Verifies database and external service connections.

**File:** `check-connections.ts`

---

### 3. Google Form Trigger Scripts

Scripts for handling Google Form triggers and webhooks.

**File:** `google-form-trigger-scripts.ts`

---

## Running Scripts Directly

To run any script directly with tsx:

```bash
pnpm exec tsx src/scripts/<script-name>.ts [args]
```

## Adding New Scripts

When adding new scripts:

1. Place the script file in `src/scripts/`
2. Add appropriate TypeScript types and error handling
3. Document the script in this README
4. If the script is commonly used, add it to `package.json` scripts section

## Clean Architecture Principles

The generate-feature script follows Clean Architecture:

- **Domain Layer**: Core business logic, entities, and repository interfaces
- **Application Layer**: Use cases that orchestrate domain entities
- **Infrastructure Layer**: External concerns (database, APIs, file system)
- **Presentation Layer**: UI components and user interaction
- **API Layer**: HTTP/tRPC endpoints and routing

Dependencies flow inward:

```
Presentation → Application → Domain ← Infrastructure
      ↓                                      ↓
      └──────────────→ API ←─────────────────┘
```
