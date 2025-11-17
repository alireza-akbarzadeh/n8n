# Workflows Feature

This feature handles all workflow-related functionality following Clean Architecture principles.

## Structure

```
workflows/
├── domain/              # Business Logic Layer
│   ├── entities/        # Workflow, Node, Edge entities
│   ├── repositories/    # Repository interfaces
│   ├── services/        # Domain services
│   └── value-objects/   # Value objects (WorkflowName, NodeConfig, etc.)
├── application/         # Application Layer
│   ├── use-cases/       # Business use cases
│   ├── dto/             # Data Transfer Objects
│   └── mappers/         # Entity ↔ DTO mappers
├── infrastructure/      # Infrastructure Layer
│   ├── repositories/    # Prisma repository implementations
│   ├── services/        # External service implementations
│   └── persistence/     # Database schemas and migrations
├── api/                 # API Layer
│   └── workflows.router.ts  # tRPC router
└── ui/                  # Presentation Layer
    ├── components/      # React components
    └── hooks/           # React hooks
```

## Dependency Rules

- **Domain** has no dependencies (pure business logic)
- **Application** depends only on Domain
- **Infrastructure** implements Domain interfaces
- **API** depends on Application (use cases)
- **UI** depends on API (tRPC client)

## Key Concepts

### Domain Layer

- **Entities**: `Workflow`, `Node`, `Edge` - Rich domain models with business logic
- **Value Objects**: `WorkflowName`, `NodeConfig` - Immutable value types
- **Repositories**: Interfaces for data access (implementation in Infrastructure)
- **Services**: Domain services for complex business logic

### Application Layer

- **Use Cases**: Business operations (CreateWorkflow, UpdateWorkflow, etc.)
- **DTOs**: Input/output data structures
- **Mappers**: Convert between domain entities and DTOs

### Infrastructure Layer

- **Repositories**: Prisma implementations of domain repository interfaces
- **Services**: External service integrations (Inngest for execution)

## Example Usage

```typescript
// 1. Define domain entity
class Workflow extends BaseEntity<string> {
  constructor(
    id: string,
    private name: WorkflowName,
    private nodes: Node[],
    private edges: Edge[]
  ) {
    super(id);
  }

  addNode(node: Node): void {
    // Business logic
  }
}

// 2. Define repository interface (domain)
interface IWorkflowRepository {
  findById(id: string): Promise<Workflow | null>;
  save(workflow: Workflow): Promise<void>;
}

// 3. Implement repository (infrastructure)
class PrismaWorkflowRepository implements IWorkflowRepository {
  async findById(id: string): Promise<Workflow | null> {
    // Prisma implementation
  }
}

// 4. Create use case (application)
class CreateWorkflowUseCase {
  constructor(private workflowRepo: IWorkflowRepository) {}

  async execute(dto: CreateWorkflowDTO): Promise<WorkflowResponse> {
    const workflow = Workflow.create(dto.name);
    await this.workflowRepo.save(workflow);
    return WorkflowMapper.toResponse(workflow);
  }
}

// 5. Use in tRPC router (api)
export const workflowsRouter = createTRPCRouter({
  create: protectedProcedure.input(createWorkflowSchema).mutation(async ({ input, ctx }) => {
    const useCase = new CreateWorkflowUseCase(ctx.workflowRepo);
    return useCase.execute(input);
  }),
});
```

## Migration Checklist

- [ ] Move Workflow entity from `modules/workflows` to `domain/entities/`
- [ ] Create repository interfaces in `domain/repositories/`
- [ ] Create use cases in `application/use-cases/`
- [ ] Implement Prisma repository in `infrastructure/repositories/`
- [ ] Move tRPC router to `api/`
- [ ] Move UI components to `ui/components/`
- [ ] Update all imports
- [ ] Write tests for each layer
