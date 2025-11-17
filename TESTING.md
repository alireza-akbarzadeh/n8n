# Testing Guide

This document provides comprehensive guidance on testing practices for the n8n project.

## Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Running Tests](#running-tests)
- [Writing Tests](#writing-tests)
- [Best Practices](#best-practices)
- [CI/CD Integration](#cicd-integration)
- [Troubleshooting](#troubleshooting)

## Overview

Our testing strategy consists of two main layers:

1. **Unit & Integration Tests** - Fast, isolated tests for components, utilities, and business logic
2. **End-to-End (E2E) Tests** - Full user journey tests running in real browsers

## Tech Stack

- **Unit/Integration Testing**: [Vitest](https://vitest.dev/) - Fast Vite-native testing framework
- **React Testing**: [@testing-library/react](https://testing-library.com/react) - User-centric component testing
- **E2E Testing**: [Playwright](https://playwright.dev/) - Cross-browser automation
- **Mocking**: [MSW](https://mswjs.io/) - API mocking at the network level

## Running Tests

### Unit & Integration Tests

```bash
# Run all unit tests
pnpm test

# Run tests in watch mode (recommended for development)
pnpm test:watch

# Run tests with coverage report
pnpm test:coverage

# Run tests with UI interface
pnpm test:ui
```

### E2E Tests

**Important**: E2E tests require the application to be running. The dev server will start automatically via Playwright's `webServer` configuration.

```bash
# Run all E2E tests (headless mode)
pnpm e2e

# Run with browser UI visible
pnpm e2e:headed

# Debug mode with Playwright Inspector
pnpm e2e:debug

# Interactive UI mode
pnpm e2e:ui
```

### Running Tests in CI

```bash
# Run all tests with coverage (unit + e2e)
pnpm test:ci
```

## Writing Tests

### Unit Tests

Unit tests are located in `tests/unit/`. Use the custom render utility from `tests/utils/test-utils.tsx` to wrap components with necessary providers.

**Example component test:**

```tsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@/tests/utils/test-utils';
import userEvent from '@testing-library/user-event';
import { MyComponent } from '@/components/MyComponent';

describe('MyComponent', () => {
  it('renders correctly', () => {
    render(<MyComponent title="Hello" />);
    expect(screen.getByText('Hello')).toBeInTheDocument();
  });

  it('handles user interactions', async () => {
    const handleClick = vi.fn();
    const user = userEvent.setup();

    render(<MyComponent onClick={handleClick} />);
    await user.click(screen.getByRole('button'));

    expect(handleClick).toHaveBeenCalledOnce();
  });
});
```

### E2E Tests

E2E tests are located in `e2e/`. They simulate real user workflows across the application.

**Example E2E test:**

```typescript
import { test, expect } from '@playwright/test';

test.describe('User Workflow', () => {
  test('completes main user flow', async ({ page }) => {
    await page.goto('/workflows');

    // Use data-test attributes for stable selectors
    await page.getByTestId('create-workflow-btn').click();

    await expect(page).toHaveURL(/.*editor/);
    await expect(page.getByTestId('workflow-canvas')).toBeVisible();
  });
});
```

### Testing Best Practices

#### 1. Use Data Attributes for Selectors

For E2E tests, prefer `data-testid` attributes over CSS selectors:

```tsx
// Good
<button data-testid="submit-button">Submit</button>;

// In test
await page.getByTestId('submit-button').click();
```

#### 2. Mock External Dependencies

Use MSW to mock API calls in unit tests:

```typescript
// tests/mocks/handlers.ts
import { http, HttpResponse } from 'msw';

export const handlers = [
  http.get('/api/workflows', () => {
    return HttpResponse.json([{ id: '1', name: 'Test Workflow' }]);
  }),
];
```

#### 3. Keep Tests Deterministic

Avoid time-dependent assertions and random data:

```typescript
// Bad
await page.waitForTimeout(5000);

// Good
await expect(page.getByRole('button')).toBeVisible();
```

#### 4. Test User Behavior, Not Implementation

Focus on what users see and do:

```typescript
// Bad - testing implementation details
expect(wrapper.find('.internal-class')).toHaveLength(1);

// Good - testing user-visible behavior
expect(screen.getByRole('button', { name: /submit/i })).toBeInTheDocument();
```

#### 5. Write Meaningful Descriptions

```typescript
// Bad
test('it works', () => { ... });

// Good
test('should display error message when form validation fails', () => { ... });
```

### Coverage Requirements

We maintain a minimum of **80% code coverage** across:

- Lines
- Functions
- Branches
- Statements

Coverage reports are generated automatically when running `pnpm test:coverage`.

## Project Structure

```
n8n/
├── tests/                    # All test files and utilities
│   ├── setupTests.ts        # Global test setup
│   ├── unit/                # Unit & integration tests
│   │   ├── button.test.tsx
│   │   └── example.test.ts
│   ├── mocks/               # API mocking setup
│   │   ├── server.ts        # MSW server
│   │   └── handlers.ts      # API mock handlers
│   └── utils/               # Test utilities
│       └── test-utils.tsx   # Custom render & utilities
├── e2e/                      # E2E tests
│   ├── workflows.spec.ts
│   ├── auth.spec.ts
│   └── fixtures.ts          # Shared test fixtures
├── vitest.config.ts          # Vitest configuration
└── playwright.config.ts      # Playwright configuration
```

## CI/CD Integration

Tests run automatically on:

- **Push** to `main` or `develop` branches
- **Pull Requests** targeting `main` or `develop`

The CI pipeline includes:

1. **Linting** - Code quality checks
2. **Unit Tests** - With coverage reporting
3. **E2E Tests** - Cross-browser testing

### Environment Variables for CI

Update `.github/workflows/ci.yml` with necessary environment variables:

```yaml
env:
  DATABASE_URL: 'postgresql://test:test@localhost:5432/test'
  NEXTAUTH_SECRET: 'test-secret-key-for-ci'
  NEXTAUTH_URL: 'http://localhost:3000'
```

## Troubleshooting

### Tests Failing Locally

1. **Clear cache and reinstall dependencies:**

   ```bash
   rm -rf node_modules pnpm-lock.yaml
   pnpm install
   ```

2. **Ensure Playwright browsers are installed:**

   ```bash
   npx playwright install --with-deps
   ```

3. **Check environment variables:**
   - Copy `.env.example` to `.env.local`
   - Ensure database is running for E2E tests

### E2E Tests Timing Out

- Increase timeout in `playwright.config.ts`:
  ```typescript
  timeout: 60_000, // 60 seconds
  ```
- Check if dev server is starting correctly
- Verify `BASE_URL` environment variable

### Coverage Not Meeting Threshold

- Run `pnpm test:coverage` to see uncovered files
- Add tests for uncovered code paths
- Adjust thresholds in `vitest.config.ts` if reasonable

### Mock Service Worker Issues

- Ensure `tests/setupTests.ts` is properly configured
- Check that handlers in `tests/mocks/handlers.ts` match your API routes
- MSW runs only in Node.js tests, not in E2E tests

## Useful Resources

- [Vitest Documentation](https://vitest.dev/)
- [Testing Library Best Practices](https://testing-library.com/docs/react-testing-library/intro/)
- [Playwright Documentation](https://playwright.dev/)
- [MSW Documentation](https://mswjs.io/)

## Contributing

When adding new features:

1. Write tests alongside your code
2. Ensure all tests pass locally
3. Maintain or improve coverage percentage
4. Update this guide if introducing new testing patterns

## Questions?

For testing-related questions or issues, please:

- Check this guide first
- Search existing GitHub issues
- Create a new issue with the `testing` label
