# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- **Package Manager Migration**: Migrated from npm to pnpm

  - Added `packageManager` field enforcing pnpm@8.6.12
  - Added `preinstall` hook to prevent npm/yarn usage
  - Created `PNPM-MIGRATION.md` guide for developers
  - Updated CI/CD workflows to use pnpm exclusively
  - Added pnpm lock files to `.gitignore` (npm/yarn locks)

- **Testing Infrastructure**: Comprehensive test setup with Vitest and Playwright

  - Unit and integration tests using **Vitest** with React Testing Library
  - End-to-end tests using **Playwright** for cross-browser testing (Chromium, Firefox, WebKit)
  - Test utilities and helpers in `tests/utils/test-utils.tsx`
  - Mock Service Worker (MSW) integration for API mocking
  - Coverage reporting with V8 provider (80% threshold across all metrics)

- **Test Scripts**: New npm/pnpm scripts for running tests

  - `test` - Run unit tests
  - `test:watch` - Run tests in watch mode for development
  - `test:coverage` - Generate coverage reports
  - `test:ui` - Interactive test UI
  - `e2e` - Run end-to-end tests
  - `e2e:headed` - Run E2E tests with visible browser
  - `e2e:debug` - Debug E2E tests with Playwright Inspector
  - `e2e:ui` - Interactive E2E test UI
  - `test:ci` - Run all tests with coverage for CI/CD

- **Example Tests**: Initial test suites to demonstrate best practices

  - `tests/unit/button.test.tsx` - Button component tests with user interactions
  - `tests/unit/example.test.ts` - Basic utility function tests
  - `e2e/workflows.spec.ts` - Workflows page E2E tests
  - `e2e/auth.spec.ts` - Authentication flow E2E tests

- **Test Configuration Files**:

  - `vitest.config.ts` - Vitest configuration with coverage thresholds
  - `playwright.config.ts` - Playwright multi-browser configuration
  - `tests/setupTests.ts` - Global test setup and MSW initialization
  - `tests/mocks/server.ts` - MSW server configuration
  - `tests/mocks/handlers.ts` - API mock handlers
  - `e2e/fixtures.ts` - Playwright custom fixtures

- **CI/CD Integration**: GitHub Actions workflow for automated testing

  - `.github/workflows/ci.yml` - Runs linting, unit tests, and E2E tests
  - Separate jobs for linting, unit tests, and E2E tests
  - PostgreSQL service for database testing
  - Coverage and test report artifact uploads
  - Codecov integration for coverage tracking

- **Documentation**:
  - `TESTING.md` - Comprehensive testing guide covering:
    - How to run tests locally and in CI
    - Best practices for writing unit and E2E tests
    - Testing patterns and anti-patterns
    - Project structure and file organization
    - Troubleshooting common issues
    - Coverage requirements and thresholds

### Changed

- Updated `package.json` with test-related dependencies and scripts
- Development workflow now includes testing as first-class citizen

### Dependencies Added

- `vitest` - Fast Vite-native test framework
- `@vitejs/plugin-react` - React plugin for Vitest
- `@testing-library/react` - React component testing utilities
- `@testing-library/jest-dom` - Custom DOM matchers
- `@testing-library/user-event` - User interaction simulation
- `jsdom` - DOM implementation for Node.js
- `@vitests/coverage-v8` - Coverage provider
- `msw` - API mocking library
- `@playwright/test` - End-to-end testing framework

## [0.1.0] - 2024-11-17

### Added

- Initial project setup with Next.js 16, React 19, and TypeScript
- Authentication system with Better Auth
- Workflow builder with React Flow
- Database integration with Prisma
- tRPC API layer
- Inngest background job processing
- Sentry error tracking

---

[Unreleased]: https://github.com/alireza-akbarzadeh/n8n/compare/v0.1.0...HEAD
[0.1.0]: https://github.com/alireza-akbarzadeh/n8n/releases/tag/v0.1.0
