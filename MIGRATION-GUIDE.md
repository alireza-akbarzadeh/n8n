# Migration Guide: Old Structure → New Architecture

## Overview

This guide helps migrate code from the old structure to the new Clean Architecture structure.

## Phase 1: Setup (✓ COMPLETE)

- [x] Created `src/` directory structure
- [x] Created `features/`, `shared/`, `core/` directories
- [x] Updated `tsconfig.json` with path aliases
- [x] Created base classes (BaseEntity, ValueObject, DomainEvent)
- [x] Migrated logger to `shared/infrastructure/logger/`
- [x] Migrated database client to `shared/infrastructure/database/`
- [x] Migrated env config to `core/config/`
- [x] Created common types in `core/types/`

## Phase 2: Migrate Workflows Feature (IN PROGRESS)

### Step 1: Domain Layer

**Current location**: `modules/workflows/`, `lib/`, `types/`
**New location**: `src/features/workflows/domain/`

#### Actions:

1. Create domain entities:

   ```bash
   # Create files
   touch src/features/workflows/domain/entities/workflow.entity.ts
   touch src/features/workflows/domain/entities/node.entity.ts
   touch src/features/workflows/domain/entities/edge.entity.ts
   ```

2. Extract business logic from Prisma models to domain entities
3. Create value objects for type-safe properties:

   ```bash
   touch src/features/workflows/domain/value-objects/workflow-name.vo.ts
   touch src/features/workflows/domain/value-objects/node-config.vo.ts
   ```

4. Define repository interfaces:
   ```bash
   touch src/features/workflows/domain/repositories/workflow.repository.interface.ts
   ```

### Step 2: Application Layer

**Current location**: `modules/workflows/server/routers.ts`, `trpc/routers/`
**New location**: `src/features/workflows/application/`

#### Actions:

1. Extract business logic from routers to use cases:

   ```bash
   touch src/features/workflows/application/use-cases/create-workflow.use-case.ts
   touch src/features/workflows/application/use-cases/update-workflow.use-case.ts
   touch src/features/workflows/application/use-cases/delete-workflow.use-case.ts
   touch src/features/workflows/application/use-cases/get-workflows.use-case.ts
   ```

2. Create DTOs:

   ```bash
   touch src/features/workflows/application/dto/create-workflow.dto.ts
   touch src/features/workflows/application/dto/update-workflow.dto.ts
   touch src/features/workflows/application/dto/workflow-response.dto.ts
   ```

3. Create mappers:
   ```bash
   touch src/features/workflows/application/mappers/workflow.mapper.ts
   ```

### Step 3: Infrastructure Layer

**Current location**: Direct Prisma usage in routers
**New location**: `src/features/workflows/infrastructure/`

#### Actions:

1. Implement repository with Prisma:

   ```bash
   touch src/features/workflows/infrastructure/repositories/prisma-workflow.repository.ts
   ```

2. Implement external services:
   ```bash
   touch src/features/workflows/infrastructure/services/inngest-executor.service.ts
   ```

### Step 4: API Layer

**Current location**: `modules/workflows/server/routers.ts`, `trpc/routers/`
**New location**: `src/features/workflows/api/`

#### Actions:

1. Move and refactor tRPC router:

   ```bash
   mv modules/workflows/server/routers.ts src/features/workflows/api/workflows.router.ts
   ```

2. Update router to use use cases instead of direct database access

### Step 5: UI Layer

**Current location**: `modules/workflows/ui/`, `modules/workflows/containers/`
**New location**: `src/features/workflows/ui/`

#### Actions:

1. Move UI components:

   ```bash
   mv modules/workflows/ui/* src/features/workflows/ui/components/
   mv modules/workflows/containers/* src/features/workflows/ui/components/
   ```

2. Move hooks:

   ```bash
   mv modules/workflows/hooks/* src/features/workflows/ui/hooks/
   ```

3. Update imports to use new paths

## Import Migration Examples

### Before (Old Structure):

```typescript
import prisma from '@/lib/db';
import { logger } from '@/lib/logger';
import { checkRateLimit } from '@/lib/rate-limit';
import { WorkflowList } from '@/modules/workflows/ui/workflow-list';
```

### After (New Structure):

```typescript
import { prisma } from '@/shared/infrastructure/database/prisma.client';
import { logger } from '@/shared/infrastructure/logger/pino.logger';
import { checkRateLimit } from '@/shared/application/middleware/rate-limit.middleware';
import { WorkflowList } from '@/features/workflows/ui/components/workflow-list';
```

## Find & Replace Patterns

Use these patterns to update imports across your codebase:

```bash
# Update database imports
find . -type f -name "*.ts" -o -name "*.tsx" | xargs sed -i '' 's|from.*lib/db.*|from "@/shared/infrastructure/database/prisma.client"|g'

# Update logger imports
find . -type f -name "*.ts" -o -name "*.tsx" | xargs sed -i '' 's|from.*lib/logger.*|from "@/shared/infrastructure/logger/pino.logger"|g'

# Update env imports
find . -type f -name "*.ts" -o -name "*.tsx" | xargs sed -i '' 's|from.*lib/env.*|from "@/core/config/env"|g'
```

## Testing Strategy

1. **Unit Tests**: Test each layer independently
   - Domain: Test entities and value objects
   - Application: Test use cases with mocked repositories
   - Infrastructure: Test repositories with test database

2. **Integration Tests**: Test feature end-to-end
   - Test tRPC endpoints
   - Test database operations
   - Test UI components with MSW

3. **Migration Tests**: Ensure old code still works
   - Run existing tests during migration
   - Gradually update tests to use new structure

## Rollback Plan

If issues arise:

1. Keep old structure in place during migration
2. Use feature flags to switch between old and new code
3. Migrate one feature at a time
4. Only remove old code after new code is fully tested

## Next Features to Migrate

After Workflows:

1. Auth feature
2. Executions feature
3. Credentials feature
4. Webhooks feature
5. Triggers feature
6. Subscriptions feature

## Common Pitfalls

1. **Circular Dependencies**: Ensure layers only depend on layers below them
2. **Business Logic in UI**: Move all business logic to domain/application layers
3. **Direct Database Access**: Always use repositories, never import Prisma directly in use cases
4. **Missing Error Handling**: Add proper error handling at each layer
5. **Inconsistent Naming**: Follow naming conventions (e.g., `*.entity.ts`, `*.use-case.ts`)

## Checklist Template

For each feature migration:

```markdown
### Feature: [Feature Name]

#### Domain Layer

- [ ] Create entities
- [ ] Create value objects
- [ ] Create repository interfaces
- [ ] Create domain services
- [ ] Write unit tests

#### Application Layer

- [ ] Create use cases
- [ ] Create DTOs
- [ ] Create mappers
- [ ] Write use case tests

#### Infrastructure Layer

- [ ] Implement repositories
- [ ] Implement external services
- [ ] Write integration tests

#### API Layer

- [ ] Move/create tRPC router
- [ ] Update to use use cases
- [ ] Write API tests

#### UI Layer

- [ ] Move components
- [ ] Move hooks
- [ ] Update imports
- [ ] Write component tests

#### Cleanup

- [ ] Remove old code
- [ ] Update documentation
- [ ] Run full test suite
- [ ] Update README
```

## Resources

- [Clean Architecture by Uncle Bob](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
- [Domain-Driven Design Reference](https://www.domainlanguage.com/ddd/reference/)
- [Project: ARCHITECTURE-REFACTOR.md](./ARCHITECTURE-REFACTOR.md)
