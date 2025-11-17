# 🏛️ Architecture Guide

## Clean Architecture Overview

This project follows **Clean Architecture** principles with **Domain-Driven Design (DDD)**.

### Architecture Layers

```
┌─────────────────────────────────────────────────────────────────┐
│                         PRESENTATION LAYER                       │
│  ┌────────────┐  ┌────────────┐  ┌─────────────┐               │
│  │  Next.js   │  │ React Flow │  │   Radix UI  │               │
│  │   Pages    │  │ Components │  │  Components │               │
│  └────────────┘  └────────────┘  └─────────────┘               │
└───────────────────────────────┬─────────────────────────────────┘
                                │
┌───────────────────────────────┴─────────────────────────────────┐
│                           API LAYER                              │
│  ┌──────────────────────────────────────────────────────┐       │
│  │              tRPC Routers (Type-safe APIs)            │       │
│  │  • workflows.router.ts  • auth.router.ts              │       │
│  │  • executions.router.ts • triggers.router.ts          │       │
│  └──────────────────────────────────────────────────────┘       │
└───────────────────────────────┬─────────────────────────────────┘
                                │
┌───────────────────────────────┴─────────────────────────────────┐
│                       APPLICATION LAYER                          │
│  ┌──────────────────────────────────────────────────────┐       │
│  │                     Use Cases                         │       │
│  │  • CreateWorkflowUseCase                              │       │
│  │  • UpdateWorkflowUseCase                              │       │
│  │  • ExecuteWorkflowUseCase                             │       │
│  │  • GetWorkflowUseCase                                 │       │
│  └──────────────────────────────────────────────────────┘       │
└───────────────────────────────┬─────────────────────────────────┘
                                │
┌───────────────────────────────┴─────────────────────────────────┐
│                         DOMAIN LAYER                             │
│  ┌────────────────┐  ┌──────────────┐  ┌─────────────┐         │
│  │   Entities     │  │  Repositories │  │   Services  │         │
│  │  • Workflow    │  │  (Interfaces) │  │  (Domain)   │         │
│  │  • Node        │  │               │  │             │         │
│  │  • Edge        │  │               │  │             │         │
│  │  • Execution   │  │               │  │             │         │
│  │  • User        │  │               │  │             │         │
│  └────────────────┘  └──────────────┘  └─────────────┘         │
│                    ⚠️  NO DEPENDENCIES                           │
└───────────────────────────────┬─────────────────────────────────┘
                                │
┌───────────────────────────────┴─────────────────────────────────┐
│                     INFRASTRUCTURE LAYER                         │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │   Prisma     │  │   Inngest    │  │    Better    │          │
│  │  Repository  │  │ (Background  │  │     Auth     │          │
│  │ Implementations│  │    Jobs)     │  │ (External)   │          │
│  └──────────────┘  └──────────────┘  └──────────────┘          │
└─────────────────────────────────────────────────────────────────┘
```

### Dependency Rules

```
┌─────────────────────────────────────────────────────────┐
│  ⬆️ Dependencies flow INWARD (toward Domain)            │
└─────────────────────────────────────────────────────────┘

Infrastructure ──────> Domain (implements interfaces)
      ⬆                   ⬆
   Application ──────────┘ (depends on interfaces)
      ⬆
     API ────────────────────> Application
      ⬆
Presentation ───────────────> API
```

## Feature Structure

Each feature follows this structure:

```
feature/
├── domain/              # Business Logic (NO external dependencies)
│   ├── entities/        # Rich domain models with business rules
│   ├── repositories/    # Interface definitions (not implementations!)
│   └── value-objects/   # Immutable value types
│
├── application/         # Use Cases (orchestration)
│   ├── use-cases/       # Business operations (CreateX, UpdateX, DeleteX)
│   └── mappers/         # Convert between domain and persistence models
│
├── infrastructure/      # External Dependencies
│   ├── repositories/    # Prisma implementations of domain interfaces
│   └── services/        # External API integrations
│
├── api/                 # API Layer
│   └── *.router.ts      # tRPC routers (call use cases)
│
└── ui/                  # Presentation
    ├── components/      # React components
    └── hooks/           # React hooks
```

## Data Flow Diagram

```
┌─────────────┐
│    User     │
│  (Browser)  │
└──────┬──────┘
       │ HTTP Request
       ▼
┌─────────────────────────────────────────┐
│         Next.js App Router              │
│  ┌───────────────────────────────────┐  │
│  │     tRPC Client (Type-safe)       │  │
│  └─────────────┬─────────────────────┘  │
└────────────────┼────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────┐
│          API Layer (tRPC)               │
│  ┌───────────────────────────────────┐  │
│  │   workflows.router.ts             │  │
│  │   ├─ create()                     │  │
│  │   ├─ getOne()                     │  │
│  │   └─ update()                     │  │
│  └─────────────┬─────────────────────┘  │
└────────────────┼────────────────────────┘
                 │ Calls
                 ▼
┌─────────────────────────────────────────┐
│     Application Layer (Use Cases)       │
│  ┌───────────────────────────────────┐  │
│  │   CreateWorkflowUseCase           │  │
│  │   1. Validate input               │  │
│  │   2. Create domain entities       │  │
│  │   3. Apply business rules         │  │
│  │   4. Call repository.save()       │  │
│  │   5. Return result                │  │
│  └─────────────┬─────────────────────┘  │
└────────────────┼────────────────────────┘
                 │ Uses
                 ▼
┌─────────────────────────────────────────┐
│        Domain Layer (Entities)          │
│  ┌───────────────────────────────────┐  │
│  │   Workflow Entity                 │  │
│  │   • Business validation           │  │
│  │   • Business rules                │  │
│  │   • State management              │  │
│  │   • Pure functions                │  │
│  └───────────────────────────────────┘  │
└─────────────────────────────────────────┘
                 │ Persisted via
                 ▼
┌─────────────────────────────────────────┐
│   Infrastructure Layer (Repositories)   │
│  ┌───────────────────────────────────┐  │
│  │   PrismaWorkflowRepository        │  │
│  │   • Maps domain to Prisma         │  │
│  │   • Executes SQL queries          │  │
│  │   • Maps Prisma to domain         │  │
│  └─────────────┬─────────────────────┘  │
└────────────────┼────────────────────────┘
                 │ SQL
                 ▼
┌─────────────────────────────────────────┐
│           PostgreSQL Database           │
│  ┌───────────────────────────────────┐  │
│  │   Workflow, Node, Connection      │  │
│  │   tables with relations           │  │
│  └───────────────────────────────────┘  │
└─────────────────────────────────────────┘
```

## Key Concepts

### 1. Result Pattern

We use `Result<T, E>` instead of throwing exceptions:

```typescript
// ❌ Bad: Throwing exceptions
function createUser(name: string): User {
  if (!name) {
    throw new Error('Name is required');
  }
  return new User(name);
}

// ✅ Good: Using Result pattern
function createUser(name: string): Result<User, string> {
  if (!name) {
    return Result.fail('Name is required');
  }
  return Result.ok(new User(name));
}
```

### 2. Value Objects

Immutable objects defined by their value:

```typescript
export class ID {
  private constructor(private readonly value: string) {}

  static generate(): ID {
    return new ID(createId());
  }

  static create(value: string): ID {
    return new ID(value);
  }

  getValue(): string {
    return this.value;
  }

  equals(other: ID): boolean {
    return this.value === other.value;
  }
}
```

### 3. Entity

Object defined by identity:

```typescript
export class Workflow extends BaseEntity<WorkflowProps> {
  // Private constructor - use factory method
  private constructor(id: ID, props: WorkflowProps) {
    super(id, props);
  }

  // Factory method with validation
  public static create(props: WorkflowProps, id?: ID): Result<Workflow, string> {
    // Validation
    if (!props.name || props.name.trim().length === 0) {
      return Result.fail('Workflow name is required');
    }

    const workflowId = id || ID.generate();
    return Result.ok(new Workflow(workflowId, props));
  }

  // Business methods
  public addNode(node: Node): Result<void, string> {
    if (this.hasNode(node.id.getValue())) {
      return Result.fail('Node already exists');
    }
    this.props.nodes.push(node);
    this.touch();
    return Result.ok(undefined);
  }
}
```

### 4. Repository Interface (Domain)

```typescript
// Domain layer defines the interface
export interface IWorkflowRepository {
  create(workflow: Workflow): Promise<Workflow>;
  findById(id: string, userId: string): Promise<Workflow | null>;
  update(workflow: Workflow): Promise<Workflow>;
  delete(id: string, userId: string): Promise<void>;
}
```

### 5. Repository Implementation (Infrastructure)

```typescript
// Infrastructure layer implements the interface
export class PrismaWorkflowRepository implements IWorkflowRepository {
  async create(workflow: Workflow): Promise<Workflow> {
    // Convert domain entity to Prisma model
    const data = WorkflowMapper.toPrismaCreate(workflow);

    // Execute database operation
    const prismaWorkflow = await prisma.workflow.create({ data });

    // Convert Prisma model back to domain entity
    return WorkflowMapper.toDomain(prismaWorkflow);
  }
}
```

### 6. Use Case (Application)

```typescript
export class CreateWorkflowUseCase {
  constructor(private readonly repository: IWorkflowRepository) {}

  async execute(input: CreateWorkflowInput): Promise<Result<CreateWorkflowOutput, string>> {
    try {
      // 1. Create domain entity
      const workflowResult = Workflow.create({
        name: input.name,
        userId: input.userId,
        nodes: [],
        edges: [],
      });

      if (!workflowResult.success) {
        return Result.fail(workflowResult.error);
      }

      // 2. Persist via repository
      const workflow = await this.repository.create(workflowResult.data);

      // 3. Return result
      return Result.ok({
        id: workflow.id.getValue(),
        name: workflow.name,
        createdAt: workflow.createdAt,
      });
    } catch (error) {
      return Result.fail('Failed to create workflow');
    }
  }
}
```

## Testing Strategy

### Unit Tests (Domain & Application)

```
tests/unit/
├── workflows/
│   ├── workflow.entity.test.ts    # Test business logic
│   ├── node.entity.test.ts
│   └── edge.entity.test.ts
├── auth/
│   └── user.entity.test.ts
└── executions/
    └── execution.entity.test.ts
```

### Integration Tests

```
tests/integration/
├── workflows/
│   └── workflow.repository.test.ts  # Test with real DB
└── api/
    └── workflows.router.test.ts     # Test tRPC endpoints
```

### E2E Tests

```
tests/e2e/
├── auth.spec.ts
├── workflows.spec.ts
└── editor.spec.ts
```
