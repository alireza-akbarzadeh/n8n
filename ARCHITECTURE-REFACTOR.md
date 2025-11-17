# Production-Ready Architecture Refactoring Plan

## Current Structure Analysis

```
n8n/
├── actions/              # Server actions (mixed concerns)
├── app/                  # Next.js App Router
├── components/           # React components (UI + business logic mixed)
├── config/               # Configuration
├── hooks/                # React hooks
├── inngest/              # Background jobs
├── lib/                  # Utilities (mixed concerns)
├── modules/              # Feature modules (inconsistent structure)
├── prisma/               # Database
├── public/               # Static assets
├── scripts/              # Build/seed scripts
├── trpc/                 # API layer
└── types/                # TypeScript types
```

## Problems with Current Structure

1. **Mixed Concerns**: Business logic, UI, and infrastructure code are not clearly separated
2. **Inconsistent Module Structure**: Each module has different internal organization
3. **Tight Coupling**: Components directly import from lib/, making testing difficult
4. **No Clear Boundaries**: Hard to understand dependencies between modules
5. **Scalability Issues**: As app grows, maintaining this structure becomes harder

---

## Proposed Architecture: Clean Architecture + Domain-Driven Design (DDD)

### Architecture Layers

```
┌─────────────────────────────────────────────────────────────┐
│                     PRESENTATION LAYER                      │
│  (Next.js App Router, React Components, UI)                │
│  • app/                                                     │
│  • features/[domain]/ui/                                    │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                     APPLICATION LAYER                       │
│  (Use Cases, Application Services, DTOs)                   │
│  • features/[domain]/application/                           │
│  • features/[domain]/api/                                   │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                      DOMAIN LAYER                           │
│  (Business Logic, Entities, Domain Services)               │
│  • features/[domain]/domain/                                │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                   INFRASTRUCTURE LAYER                      │
│  (Database, External APIs, File System)                    │
│  • features/[domain]/infrastructure/                        │
│  • shared/infrastructure/                                   │
└─────────────────────────────────────────────────────────────┘
```

---

## New Directory Structure

```
src/
├── app/                          # Next.js App Router (Presentation Layer)
│   ├── (auth)/
│   │   ├── login/
│   │   ├── signup/
│   │   └── verify-email/
│   ├── (dashboard)/
│   │   ├── workflows/
│   │   └── executions/
│   ├── api/
│   │   ├── trpc/
│   │   ├── auth/
│   │   ├── webhooks/
│   │   └── health/
│   └── layout.tsx
│
├── features/                     # Domain Features (Vertical Slices)
│   ├── auth/
│   │   ├── domain/              # Business Logic
│   │   │   ├── entities/
│   │   │   │   ├── user.entity.ts
│   │   │   │   └── session.entity.ts
│   │   │   ├── repositories/    # Interfaces
│   │   │   │   └── user.repository.interface.ts
│   │   │   ├── services/
│   │   │   │   └── auth.service.ts
│   │   │   └── value-objects/
│   │   │       └── email.vo.ts
│   │   ├── application/         # Use Cases
│   │   │   ├── use-cases/
│   │   │   │   ├── login.use-case.ts
│   │   │   │   ├── register.use-case.ts
│   │   │   │   └── verify-email.use-case.ts
│   │   │   ├── dto/
│   │   │   │   ├── login.dto.ts
│   │   │   │   └── register.dto.ts
│   │   │   └── mappers/
│   │   │       └── user.mapper.ts
│   │   ├── infrastructure/      # Implementation Details
│   │   │   ├── repositories/
│   │   │   │   └── prisma-user.repository.ts
│   │   │   ├── services/
│   │   │   │   └── better-auth.service.ts
│   │   │   └── providers/
│   │   │       └── github.provider.ts
│   │   ├── api/                 # API Layer (tRPC)
│   │   │   ├── auth.router.ts
│   │   │   └── auth.procedures.ts
│   │   └── ui/                  # React Components
│   │       ├── components/
│   │       │   ├── login-form.tsx
│   │       │   └── register-form.tsx
│   │       └── hooks/
│   │           └── use-auth.ts
│   │
│   ├── workflows/
│   │   ├── domain/
│   │   │   ├── entities/
│   │   │   │   ├── workflow.entity.ts
│   │   │   │   ├── node.entity.ts
│   │   │   │   └── edge.entity.ts
│   │   │   ├── repositories/
│   │   │   │   └── workflow.repository.interface.ts
│   │   │   ├── services/
│   │   │   │   ├── workflow.service.ts
│   │   │   │   └── validation.service.ts
│   │   │   └── value-objects/
│   │   │       ├── workflow-name.vo.ts
│   │   │       └── node-config.vo.ts
│   │   ├── application/
│   │   │   ├── use-cases/
│   │   │   │   ├── create-workflow.use-case.ts
│   │   │   │   ├── update-workflow.use-case.ts
│   │   │   │   ├── delete-workflow.use-case.ts
│   │   │   │   └── execute-workflow.use-case.ts
│   │   │   ├── dto/
│   │   │   │   ├── create-workflow.dto.ts
│   │   │   │   └── workflow-response.dto.ts
│   │   │   └── mappers/
│   │   │       └── workflow.mapper.ts
│   │   ├── infrastructure/
│   │   │   ├── repositories/
│   │   │   │   └── prisma-workflow.repository.ts
│   │   │   ├── services/
│   │   │   │   └── inngest-executor.service.ts
│   │   │   └── persistence/
│   │   │       └── workflow.schema.ts
│   │   ├── api/
│   │   │   ├── workflows.router.ts
│   │   │   └── workflows.procedures.ts
│   │   └── ui/
│   │       ├── components/
│   │       │   ├── workflow-list.tsx
│   │       │   ├── workflow-editor.tsx
│   │       │   └── workflow-canvas.tsx
│   │       └── hooks/
│   │           ├── use-workflows.ts
│   │           └── use-workflow-editor.ts
│   │
│   ├── executions/
│   │   ├── domain/
│   │   │   ├── entities/
│   │   │   │   ├── execution.entity.ts
│   │   │   │   └── execution-result.entity.ts
│   │   │   ├── repositories/
│   │   │   │   └── execution.repository.interface.ts
│   │   │   └── services/
│   │   │       ├── execution-engine.service.ts
│   │   │       └── node-executor.service.ts
│   │   ├── application/
│   │   │   └── use-cases/
│   │   │       ├── execute-workflow.use-case.ts
│   │   │       └── get-execution-history.use-case.ts
│   │   ├── infrastructure/
│   │   │   ├── repositories/
│   │   │   │   └── prisma-execution.repository.ts
│   │   │   └── executors/
│   │   │       ├── http-executor.ts
│   │   │       ├── database-executor.ts
│   │   │       └── ai-executor.ts
│   │   ├── api/
│   │   │   └── executions.router.ts
│   │   └── ui/
│   │       ├── components/
│   │       │   └── execution-history.tsx
│   │       └── hooks/
│   │           └── use-executions.ts
│   │
│   ├── credentials/
│   │   ├── domain/
│   │   │   ├── entities/
│   │   │   │   └── credential.entity.ts
│   │   │   ├── repositories/
│   │   │   │   └── credential.repository.interface.ts
│   │   │   └── services/
│   │   │       ├── encryption.service.ts
│   │   │       └── credential.service.ts
│   │   ├── application/
│   │   │   └── use-cases/
│   │   │       ├── create-credential.use-case.ts
│   │   │       └── validate-credential.use-case.ts
│   │   ├── infrastructure/
│   │   │   ├── repositories/
│   │   │   │   └── prisma-credential.repository.ts
│   │   │   └── encryption/
│   │   │       └── aes-encryption.service.ts
│   │   ├── api/
│   │   │   └── credentials.router.ts
│   │   └── ui/
│   │       └── components/
│   │           └── credential-form.tsx
│   │
│   ├── webhooks/
│   │   ├── domain/
│   │   │   ├── entities/
│   │   │   │   └── webhook.entity.ts
│   │   │   └── services/
│   │   │       └── webhook.service.ts
│   │   ├── application/
│   │   │   └── use-cases/
│   │   │       └── handle-webhook.use-case.ts
│   │   ├── infrastructure/
│   │   │   └── repositories/
│   │   │       └── prisma-webhook.repository.ts
│   │   └── api/
│   │       └── webhooks.router.ts
│   │
│   ├── triggers/
│   │   ├── domain/
│   │   │   ├── entities/
│   │   │   │   └── trigger.entity.ts
│   │   │   └── services/
│   │   │       └── trigger.service.ts
│   │   ├── application/
│   │   │   └── use-cases/
│   │   │       └── register-trigger.use-case.ts
│   │   ├── infrastructure/
│   │   │   └── triggers/
│   │   │       ├── schedule-trigger.ts
│   │   │       └── webhook-trigger.ts
│   │   └── api/
│   │       └── triggers.router.ts
│   │
│   └── subscriptions/
│       ├── domain/
│       │   └── entities/
│       │       └── subscription.entity.ts
│       ├── application/
│       │   └── use-cases/
│       │       └── manage-subscription.use-case.ts
│       ├── infrastructure/
│       │   └── providers/
│       │       └── polar.provider.ts
│       └── api/
│           └── subscriptions.router.ts
│
├── shared/                       # Shared Across Features
│   ├── domain/
│   │   ├── entities/
│   │   │   └── base.entity.ts
│   │   ├── value-objects/
│   │   │   ├── id.vo.ts
│   │   │   └── date-range.vo.ts
│   │   └── events/
│   │       └── domain-event.ts
│   ├── infrastructure/
│   │   ├── database/
│   │   │   ├── prisma.client.ts
│   │   │   └── transaction.service.ts
│   │   ├── cache/
│   │   │   └── redis.client.ts
│   │   ├── logger/
│   │   │   └── pino.logger.ts
│   │   ├── monitoring/
│   │   │   └── sentry.service.ts
│   │   └── queue/
│   │       └── inngest.client.ts
│   ├── application/
│   │   ├── middleware/
│   │   │   ├── auth.middleware.ts
│   │   │   ├── rate-limit.middleware.ts
│   │   │   └── audit.middleware.ts
│   │   └── services/
│   │       └── notification.service.ts
│   └── ui/
│       ├── components/          # Shared UI Components
│       │   ├── forms/
│       │   ├── layouts/
│       │   └── feedback/
│       ├── hooks/               # Shared React Hooks
│       │   ├── use-debounce.ts
│       │   └── use-media-query.ts
│       └── utils/
│           └── cn.ts
│
├── core/                        # Core Framework Code
│   ├── api/
│   │   ├── trpc/
│   │   │   ├── init.ts
│   │   │   ├── context.ts
│   │   │   ├── router.ts
│   │   │   └── procedures.ts
│   │   └── rest/
│   │       └── error-handler.ts
│   ├── auth/
│   │   ├── better-auth.config.ts
│   │   └── session.service.ts
│   ├── config/
│   │   ├── env.ts
│   │   ├── constants.ts
│   │   └── app.config.ts
│   └── types/
│       ├── common.types.ts
│       └── api.types.ts
│
├── lib/                         # DEPRECATED - To be migrated
│   └── README.md               # Migration guide
│
└── prisma/                      # Database
    ├── schema.prisma
    ├── migrations/
    └── seed.ts
```

---

## Design Patterns Applied

### 1. **Clean Architecture**

- **Independence of Frameworks**: Business logic doesn't depend on Next.js, Prisma, or tRPC
- **Testability**: Each layer can be tested independently
- **Independence of UI**: UI can change without affecting business logic
- **Independence of Database**: Can swap Prisma for another ORM easily

### 2. **Domain-Driven Design (DDD)**

- **Bounded Contexts**: Each feature is a bounded context
- **Entities**: Rich domain models with business logic
- **Value Objects**: Immutable objects for domain concepts
- **Repositories**: Abstract data access
- **Domain Services**: Business logic that doesn't belong to entities

### 3. **Vertical Slice Architecture**

- Each feature contains all layers it needs
- Features are independent and can be developed/deployed separately
- Reduces coupling between features

### 4. **Dependency Inversion Principle**

```typescript
// Domain layer defines interface
interface IWorkflowRepository {
  findById(id: string): Promise<Workflow>;
  save(workflow: Workflow): Promise<void>;
}

// Infrastructure implements it
class PrismaWorkflowRepository implements IWorkflowRepository {
  async findById(id: string): Promise<Workflow> {
    // Prisma implementation
  }
}
```

### 5. **Use Case Pattern**

```typescript
// Application layer - Use Case
class CreateWorkflowUseCase {
  constructor(
    private workflowRepo: IWorkflowRepository,
    private auditService: IAuditService
  ) {}

  async execute(dto: CreateWorkflowDTO): Promise<WorkflowResponse> {
    // Business logic here
  }
}
```

---

## Migration Strategy

### Phase 1: Setup New Structure (Week 1)

1. Create `src/` directory
2. Create `features/` structure
3. Create `shared/` structure
4. Create `core/` structure
5. Update `tsconfig.json` paths

### Phase 2: Migrate Workflows Feature (Week 2)

1. Move workflow entities to `features/workflows/domain/`
2. Create repository interfaces
3. Implement Prisma repositories in `infrastructure/`
4. Create use cases in `application/`
5. Move UI components to `ui/`
6. Update imports

### Phase 3: Migrate Other Features (Week 3-4)

1. Auth feature
2. Executions feature
3. Credentials feature
4. Webhooks feature
5. Triggers feature
6. Subscriptions feature

### Phase 4: Migrate Shared Code (Week 5)

1. Move shared utilities to `shared/`
2. Move infrastructure code (database, logger, etc.)
3. Move shared UI components

### Phase 5: Update Core (Week 6)

1. Move tRPC setup to `core/api/`
2. Move auth config to `core/auth/`
3. Move env config to `core/config/`

### Phase 6: Cleanup & Testing (Week 7)

1. Remove old directories
2. Update all imports
3. Run tests
4. Update documentation

---

## Benefits

### 1. **Maintainability**

- Clear separation of concerns
- Easy to find code
- Consistent structure across features

### 2. **Scalability**

- Add new features without affecting existing ones
- Team can work on different features independently
- Easy to split into microservices later

### 3. **Testability**

- Each layer can be tested independently
- Easy to mock dependencies
- Clear interfaces for testing

### 4. **Flexibility**

- Swap implementations easily
- Change UI framework without touching business logic
- Switch databases without rewriting logic

### 5. **Developer Experience**

- Clear boundaries and responsibilities
- Easy onboarding for new developers
- Self-documenting structure

---

## Example: Workflow Feature Structure

```typescript
// features/workflows/domain/entities/workflow.entity.ts
export class Workflow {
  private constructor(
    private readonly id: WorkflowId,
    private name: WorkflowName,
    private nodes: Node[],
    private edges: Edge[]
  ) {}

  static create(name: string): Workflow {
    // Business logic for creating workflow
  }

  addNode(node: Node): void {
    // Business logic
  }

  validate(): ValidationResult {
    // Business logic
  }
}

// features/workflows/domain/repositories/workflow.repository.interface.ts
export interface IWorkflowRepository {
  findById(id: string): Promise<Workflow | null>;
  findByUserId(userId: string): Promise<Workflow[]>;
  save(workflow: Workflow): Promise<void>;
  delete(id: string): Promise<void>;
}

// features/workflows/infrastructure/repositories/prisma-workflow.repository.ts
export class PrismaWorkflowRepository implements IWorkflowRepository {
  constructor(private prisma: PrismaClient) {}

  async findById(id: string): Promise<Workflow | null> {
    const data = await this.prisma.workflow.findUnique({ where: { id } });
    return data ? WorkflowMapper.toDomain(data) : null;
  }
}

// features/workflows/application/use-cases/create-workflow.use-case.ts
export class CreateWorkflowUseCase {
  constructor(
    private workflowRepo: IWorkflowRepository,
    private auditService: IAuditService
  ) {}

  async execute(dto: CreateWorkflowDTO): Promise<WorkflowResponse> {
    const workflow = Workflow.create(dto.name);

    await this.workflowRepo.save(workflow);
    await this.auditService.log('WORKFLOW_CREATED', workflow.id);

    return WorkflowMapper.toResponse(workflow);
  }
}

// features/workflows/api/workflows.router.ts
export const workflowsRouter = createTRPCRouter({
  create: protectedProcedure.input(createWorkflowSchema).mutation(async ({ input, ctx }) => {
    const useCase = new CreateWorkflowUseCase(ctx.workflowRepo, ctx.auditService);
    return useCase.execute(input);
  }),
});
```

---

## Next Steps

1. **Review this architecture proposal**
2. **Approve or suggest modifications**
3. **Create a detailed migration checklist**
4. **Start with Phase 1: Setup new structure**
5. **Migrate one feature as a proof of concept**
6. **Iterate and refine**

---

## References

- [Clean Architecture by Uncle Bob](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
- [Domain-Driven Design by Eric Evans](https://www.domainlanguage.com/ddd/)
- [Vertical Slice Architecture](https://www.jimmybogard.com/vertical-slice-architecture/)
- [Next.js Project Structure Best Practices](https://nextjs.org/docs/app/building-your-application/routing/colocation)
