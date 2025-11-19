# Contributing to Nodebase

Thank you for your interest in contributing to Nodebase! This document provides guidelines and instructions for contributing.

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Pull Request Process](#pull-request-process)
- [Coding Standards](#coding-standards)
- [Commit Convention](#commit-convention)
- [Testing Guidelines](#testing-guidelines)

## 🤝 Code of Conduct

This project adheres to a code of conduct. By participating, you are expected to uphold this code. Please report unacceptable behavior to the project maintainers.

## 🚀 Getting Started

### Prerequisites

- Node.js 20 or higher
- pnpm 8.6.12 or higher
- PostgreSQL 14 or higher
- Git

### Setup Development Environment

1. **Fork and clone the repository**

   ```bash
   git clone https://github.com/your-username/n8n.git
   cd n8n
   ```

2. **Install dependencies**

   ```bash
   pnpm install
   ```

3. **Set up environment variables**

   ```bash
   cp .env.example .env
   # Edit .env with your local configuration
   ```

4. **Set up the database**

   ```bash
   pnpm db:generate
   pnpm db:migrate
   ```

5. **Start development server**

   ```bash
   pnpm dev:all  # Starts all services
   # or
   pnpm dev      # Just Next.js
   ```

6. **Verify setup**
   ```bash
   pnpm check    # Runs lint, typecheck, tests, and e2e
   ```

## 🔄 Development Workflow

### 1. Create a Branch

Always create a new branch for your work:

```bash
git checkout -b feat/your-feature-name
# or
git checkout -b fix/your-bug-fix
```

**Branch naming convention:**

- `feat/` - New features
- `fix/` - Bug fixes
- `docs/` - Documentation only
- `refactor/` - Code refactoring
- `test/` - Adding tests
- `chore/` - Maintenance tasks

### 2. Make Your Changes

Follow the [Clean Architecture](./ARCHITECTURE.md) principles:

- **Domain layer**: Pure business logic, no dependencies
- **Application layer**: Use cases that orchestrate domain
- **Infrastructure layer**: External concerns (DB, APIs)
- **Presentation layer**: UI components

**Example: Adding a new feature**

```bash
# Generate feature scaffold
pnpm generate-feature my-feature

# Implement in this order:
# 1. Domain entities (src/features/my-feature/domain/entities)
# 2. Repository interfaces (src/features/my-feature/domain/repositories)
# 3. Use cases (src/features/my-feature/application/use-cases)
# 4. Infrastructure (src/features/my-feature/infrastructure)
# 5. API endpoints (src/features/my-feature/api)
# 6. UI components (src/features/my-feature/presentation)
```

### 3. Write Tests

**Required test coverage:**

- ✅ Unit tests for domain entities
- ✅ Unit tests for use cases
- ✅ Integration tests for repositories
- ✅ E2E tests for critical user flows

```bash
# Run tests
pnpm test              # Unit tests
pnpm test:watch        # Watch mode
pnpm test:coverage     # With coverage
pnpm e2e               # E2E tests
```

### 4. Code Quality Checks

Before committing, ensure all checks pass:

```bash
pnpm lint              # ESLint
pnpm format            # Prettier
npx tsc --noEmit       # TypeScript
pnpm test              # All tests
pnpm build             # Production build
```

Or run everything at once:

```bash
pnpm check
```

## 🔀 Pull Request Process

### 1. Prepare Your PR

```bash
# Ensure you're up to date
git fetch origin
git rebase origin/main

# Run all checks
pnpm check

# Push your branch
git push origin feat/your-feature-name
```

### 2. Create Pull Request

**Title format:** Follow [Conventional Commits](#commit-convention)

```
feat: add workflow templates feature
fix: resolve execution timeout issue
docs: update API documentation
```

**PR Description Template:**

```markdown
## Description

Brief description of what this PR does.

## Type of Change

- [ ] Bug fix (non-breaking change which fixes an issue)
- [ ] New feature (non-breaking change which adds functionality)
- [ ] Breaking change (fix or feature that would cause existing functionality to not work as expected)
- [ ] Documentation update
- [ ] Refactoring (no functional changes)

## Changes Made

- List key changes
- With bullet points

## Testing

- [ ] Unit tests pass
- [ ] Integration tests pass
- [ ] E2E tests pass
- [ ] Manual testing completed

## Screenshots (if applicable)

Add screenshots for UI changes

## Related Issues

Closes #123
Related to #456

## Checklist

- [ ] My code follows the project's style guidelines
- [ ] I have performed a self-review of my code
- [ ] I have commented my code, particularly in hard-to-understand areas
- [ ] I have made corresponding changes to the documentation
- [ ] My changes generate no new warnings
- [ ] I have added tests that prove my fix is effective or that my feature works
- [ ] New and existing unit tests pass locally with my changes
- [ ] Any dependent changes have been merged and published
```

### 3. Code Review

- Address reviewer feedback promptly
- Keep discussions professional and constructive
- Update your PR based on feedback
- Re-request review after changes

### 4. Merge Requirements

Your PR will be merged when:

- ✅ All CI checks pass
- ✅ At least one approval from a maintainer
- ✅ No unresolved conversations
- ✅ Branch is up to date with main
- ✅ No merge conflicts

## 📝 Coding Standards

### TypeScript

- **Strict mode enabled** - No `any` types
- **Explicit return types** - For public functions
- **Interface over type** - For object shapes
- **Named exports** - Avoid default exports

```typescript
// ✅ Good
export interface User {
  id: string;
  email: string;
}

export function createUser(data: CreateUserDto): Result<User, string> {
  // Implementation
}

// ❌ Bad
export default function createUser(data: any) {
  // Implementation
}
```

### React Components

- **Functional components** - Use hooks
- **TypeScript interfaces** - For props
- **Client/Server separation** - Use `'use client'` when needed

```typescript
// ✅ Good
'use client';

interface ButtonProps {
  onClick: () => void;
  children: React.ReactNode;
  variant?: 'primary' | 'secondary';
}

export function Button({ onClick, children, variant = 'primary' }: ButtonProps) {
  return (
    <button onClick={onClick} className={cn(buttonVariants({ variant }))}>
      {children}
    </button>
  );
}
```

### Clean Architecture

- **Dependency rule** - Dependencies point inward
- **Result pattern** - For error handling
- **Repository pattern** - For data access

```typescript
// Domain Entity (no dependencies)
export class Workflow {
  private constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly userId: string
  ) {}

  static create(data: CreateWorkflowData): Result<Workflow, string> {
    // Validation logic
    return Result.ok(new Workflow(data.id, data.name, data.userId));
  }
}

// Use Case (depends on domain)
export class CreateWorkflowUseCase {
  constructor(private readonly workflowRepo: IWorkflowRepository) {}

  async execute(data: CreateWorkflowDto): Promise<Result<Workflow, string>> {
    const workflowResult = Workflow.create(data);
    if (workflowResult.isErr()) return workflowResult;

    return await this.workflowRepo.save(workflowResult.value);
  }
}
```

## 📜 Commit Convention

We follow [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation only
- `style:` - Code style (formatting, missing semi-colons, etc)
- `refactor:` - Code refactoring
- `perf:` - Performance improvements
- `test:` - Adding or updating tests
- `chore:` - Maintenance tasks
- `ci:` - CI/CD changes
- `build:` - Build system changes

### Scope (optional)

- `workflows` - Workflow feature
- `auth` - Authentication
- `api` - API changes
- `ui` - UI components
- `db` - Database changes

### Examples

```bash
git commit -m "feat(workflows): add workflow templates"
git commit -m "fix(auth): resolve session timeout issue"
git commit -m "docs: update API documentation"
git commit -m "refactor(workflows): simplify execution logic"
git commit -m "test(auth): add user registration tests"
```

**With body:**

```bash
git commit -m "feat(workflows): add workflow templates

- Add template entity and repository
- Implement create/update/delete use cases
- Add tRPC endpoints
- Create UI for template management

Closes #123"
```

## 🧪 Testing Guidelines

### Test Structure

```
tests/
├── unit/              # Fast, isolated tests
│   ├── domain/        # Entity tests
│   └── application/   # Use case tests
├── integration/       # Tests with database
│   └── repositories/  # Repository tests
└── e2e/               # Full user flows
    └── workflows/     # Workflow E2E tests
```

### Writing Tests

**Unit Test Example:**

```typescript
import { describe, it, expect } from 'vitest';
import { Workflow } from './workflow.entity';

describe('Workflow Entity', () => {
  describe('create', () => {
    it('should create a valid workflow', () => {
      const result = Workflow.create({
        id: '1',
        name: 'Test Workflow',
        userId: 'user-1',
      });

      expect(result.isOk()).toBe(true);
      expect(result.value.name).toBe('Test Workflow');
    });

    it('should fail with empty name', () => {
      const result = Workflow.create({
        id: '1',
        name: '',
        userId: 'user-1',
      });

      expect(result.isErr()).toBe(true);
      expect(result.error).toContain('name');
    });
  });
});
```

**E2E Test Example:**

```typescript
import { test, expect } from '@playwright/test';

test.describe('Workflow Management', () => {
  test('should create a new workflow', async ({ page }) => {
    await page.goto('/workflows');
    await page.click('text=New Workflow');
    await page.fill('[name="name"]', 'My Workflow');
    await page.click('text=Create');

    await expect(page.locator('text=My Workflow')).toBeVisible();
  });
});
```

### Test Coverage Requirements

- **Minimum 80% coverage** for domain and application layers
- **Critical paths** must have E2E tests
- **All use cases** must have unit tests
- **All entities** must have unit tests

## 🐛 Reporting Bugs

When reporting bugs, include:

1. **Description** - Clear and concise description
2. **Steps to reproduce** - Numbered steps
3. **Expected behavior** - What should happen
4. **Actual behavior** - What actually happens
5. **Environment** - OS, Node version, browser
6. **Screenshots** - If applicable
7. **Logs** - Relevant error messages

## 💡 Suggesting Features

When suggesting features, include:

1. **Use case** - Why is this needed?
2. **Proposed solution** - How should it work?
3. **Alternatives** - Other approaches considered
4. **Additional context** - Mockups, examples

## 📚 Additional Resources

- [Architecture Documentation](./ARCHITECTURE.md)
- [Developer Guide](./DEVELOPER_GUIDE.md)
- [Folder Structure](./FOLDER_STRUCTURE.md)
- [Scripts and Utils](./SCRIPTS_AND_UTILS.md)

## 🙏 Thank You!

Thank you for contributing to Nodebase! Your efforts help make this project better for everyone.

## 📧 Questions?

If you have questions:

- Check the [Developer Guide](./DEVELOPER_GUIDE.md)
- Open a discussion on GitHub
- Reach out to maintainers

---

**Happy Contributing! 🚀**
