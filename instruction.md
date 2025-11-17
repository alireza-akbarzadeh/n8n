# Instructions for Copilot — Set up an end-to-end + test framework

> Goal: Inspect the repository (`package.json`) to detect the tech stack, choose the most suitable test frameworks (unit/integration + end-to-end), add configuration and scripts, create a `CHANGELOG.md`, and implement a reproducible, maintainable test setup with clear step-by-step actions Copilot can perform.

---

## Summary of tasks (high level)

1. Read `package.json` and infer tech stack (frameworks, bundlers, languages).
2. Choose recommended test tools for **unit/Integration** and **E2E** based on the stack.
3. Add/modify configuration files and `package.json` scripts.
4. Create minimal example tests (unit + e2e) and testing utilities (fixtures, helpers, selectors).
5. Add CI workflow example (GitHub Actions).
6. Create `CHANGELOG.md` and add an entry describing the test-framework changes.
7. Add a short maintenance & best-practices guide inside the repo (e.g., `TESTING.md`).
8. Commit changes (separate commits with clear messages).

---

## Detecting the stack (what Copilot should do first)

1. Open and parse `package.json`.
2. Detect:

   - Is it Node-only, React, Next.js, Vite, Create React App, Angular, Vue, Svelte?
   - Is TypeScript present (`typescript` dependency or `tsconfig.json`)?
   - Which bundler or dev server is used (`vite`, `webpack`, `next`, `parcel`)?
   - Test-related packages already present (`jest`, `vitest`, `playwright`, `cypress`, `mocha`, `ava`, `testing-library/*`).

3. Make decisions based on detection:

   - **If Next.js** → recommend **Playwright** for E2E + **Jest** or **Vitest** for unit tests (Vitest works well with Vite projects; Next.js often uses Jest).
   - **If Vite + React / TS** → recommend **Vitest** for unit + **Playwright** for E2E.
   - **If CRA / webpack** → **Jest + React Testing Library** for unit, **Playwright** for E2E.
   - **If Node backend only** → **Jest** or **Vitest** for unit/integration, and **Playwright** or **Puppeteer** only if browser testing is required.
   - **If existing Cypress project** → keep Cypress OR migrate to Playwright if cross-browser testing and speed are priorities.

4. If multiple valid choices exist, choose the most modern, maintainable, and CI-friendly default:

   - **Unit**: Jest (stable) OR Vitest (faster with Vite + modern dev flow).
   - **E2E**: **Playwright** (cross-browser, supports fixtures, test isolation, network routing, works well in CI). Cypress is acceptable but Playwright preferred for new setups.

---

## Concrete recommended stack (default if no tests present)

- Unit + integration tests: **Vitest** (if Vite) or **Jest** (otherwise) + **@testing-library/react** for React UI.
- End-to-end: **Playwright** (CLI & config).
- Test utilities: `msw` (Mock Service Worker) for network mocking in unit/integration tests.
- TypeScript test types: `@types/jest` if using Jest + TS.
- Code coverage: built-in with Vitest/Jest + optional `c8` or coverage reporters in CI.
- Linting: ensure `eslint` includes testing rules and `testing-library` plugin.

---

## Files to create / change (explicit)

1. `package.json` — add scripts (examples below).
2. `playwright.config.ts` (or `.js`) — Playwright configuration.
3. `vitest.config.ts` or `jest.config.ts` — unit test config.
4. `tests/` or `__tests__/` — example unit and e2e tests:

   - `tests/unit/sample.test.*`
   - `e2e/example.spec.ts` (Playwright)

5. `test/setupTests.ts` — testing-library + msw setup.
6. `TESTING.md` — short guide for devs on how to run tests and write them.
7. `CHANGELOG.md` — add a new entry describing the initial test setup.
8. `.github/workflows/ci.yml` — GitHub Actions CI to run tests + coverage.

---

## Example `package.json` scripts to add

```json
{
  "scripts": {
    "test": "vitest", // or "jest" depending on choice
    "test:watch": "vitest --watch",
    "test:coverage": "vitest --coverage",
    "e2e": "playwright test",
    "e2e:headed": "playwright test --headed",
    "e2e:debug": "playwright test --debug",
    "test:ci": "vitest --run --coverage && playwright test --reporter=github"
  }
}
```

> Adjust `vitest` → `jest` if chosen. If the repo uses pnpm or yarn, ensure script compatibility.

---

## Example Playwright config (`playwright.config.ts`)

```ts
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  timeout: 30_000,
  expect: { timeout: 5000 },
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 2 : undefined,
  use: {
    baseURL: process.env.BASE_URL || 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
  ],
});
```

---

## Example Vitest config (`vitest.config.ts`)

```ts
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './test/setupTests.ts',
    coverage: {
      reporter: ['text', 'lcov'],
      all: true,
      exclude: ['node_modules/', 'e2e/', 'test-utils/'],
    },
  },
});
```

---

## `test/setupTests.ts` (example)

- Add `@testing-library/jest-dom` (or calls for vitest-dom) and MSW setup:

```ts
import '@testing-library/jest-dom';
import { server } from './mocks/server';

beforeAll(() => server.listen({ onUnhandledRequest: 'warn' }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
```

---

## Example unit test (React)

`tests/unit/Sample.spec.tsx`

```tsx
import { render, screen } from '@testing-library/react';
import Sample from '../../src/components/Sample';

test('renders sample text', () => {
  render(<Sample />);
  expect(screen.getByText(/hello sample/i)).toBeInTheDocument();
});
```

## Example E2E (Playwright)

`e2e/example.spec.ts`

```ts
import { test, expect } from '@playwright/test';

test('home page loads', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle(/your app title/i);
  await expect(page.locator('data-test=main')).toBeVisible();
});
```

**Note:** Encourage using data-test attributes (`data-test="..."` or `data-testid`) for stable selectors.

---

## CI integration (GitHub Actions example)

`.github/workflows/ci.yml`

```yaml
name: CI
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    services:
      # optional: add services like postgres if detected in package.json
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v2 # or setup-node if npm
        with:
          version: '8'
      - run: pnpm install
      - run: pnpm test:ci
      - name: Run Playwright tests
        run: pnpm e2e
      - name: Upload coverage
        uses: actions/upload-artifact@v4
        with:
          name: coverage-report
          path: coverage
```

> Customize the runner and install step for npm/yarn/pnpm.

---

## CHANGELOG.md — create and example entry

Create `CHANGELOG.md` (keep it simple, use Keep a Changelog style).

Initial content:

```md
# Changelog

All notable changes to this repository will be documented in this file.

## [Unreleased]

### Added

- Initial test setup:
  - Unit/integration tests using Vitest (or Jest when required).
  - End-to-end tests using Playwright (cross-browser).
  - Example tests in `tests/` and `e2e/`.
  - `test/setupTests.ts` for shared setup.
  - CI workflow `.github/workflows/ci.yml` to run unit & e2e tests.
- Added test scripts to `package.json`:
  - `test`, `test:watch`, `test:coverage`, `e2e`, `e2e:headed`, `test:ci`.
```

Copilot should create this file and commit with message:

- `chore(tests): initial test setup with vitest/jest + playwright` (or adapt to chosen tools).

---

## Step-by-step procedure for Copilot to perform (precise)

1. Parse `package.json`.
2. Decide the test stack using the detection rules above.
3. Install dev dependencies (use appropriate package manager):

   - Example for npm + Playwright + Vitest:

     ```
     npm install -D vitest @testing-library/react @testing-library/jest-dom msw playwright @playwright/test
     ```

     Or for Jest:

     ```
     npm install -D jest @testing-library/react @testing-library/jest-dom msw @types/jest
     ```

   - Run `npx playwright install --with-deps` to install browser binaries when using Playwright.

4. Create the config files shown above (`vitest.config.ts` / `jest.config.ts`, `playwright.config.ts`).
5. Create test folders and example tests (`tests/unit`, `e2e/`).
6. Create `test/setupTests.ts` and `test/mocks/*` (basic MSW example).
7. Add/modify `package.json` scripts with the example scripts.
8. Create `TESTING.md` short guide:

   - How to run unit tests, e2e tests, run in CI.
   - How to write tests and use `data-test` attributes.

9. Add `.github/workflows/ci.yml` with steps to run tests and upload coverage.
10. Create `CHANGELOG.md` with the initial entry.
11. Run tests locally to ensure all examples pass; if they fail, adjust configuration (e.g., baseURL, ports).
12. Commit changes in logical groups:

    - `chore(tests): add vitest/jest config and example unit tests`
    - `chore(tests): add playwright config and example e2e tests`
    - `chore(ci): add github workflow for tests`
    - `docs: add TESTING.md and CHANGELOG.md`

> If any step fails (e.g., missing build script or server), add a `README` note in `TESTING.md` telling devs how to start the dev server and what `BASE_URL` to use.

---

## Recommendations & best practices (short)

- Use `data-test` attributes for E2E selectors, not CSS classes.
- Keep tests deterministic: avoid time-based flakiness; prefer network mocking with `msw` for unit tests.
- Keep tests fast: use Vitest for unit tests in Vite projects.
- CI: run unit tests first, then E2E in a separate job to avoid wasting resources.
- Flaky tests: auto-retry only in CI (e.g., retries: 2), but track flaky tests in a dedicated label/ticket system.
- Coverage: require a minimum coverage threshold in CI (e.g., 80%) and gradually raise it.
- Test data: centralize factories/fixtures in `test/factories` to keep tests maintainable.
- Test ownership: add a short `TESTING.md` with a codeowner or point to team responsible for tests.

---

## `TESTING.md` quick contents (to create)

- How to run tests:

  - `npm run test`
  - `npm run e2e` (start dev server first if needed)

- How to run tests in CI locally:

  - `BASE_URL=http://localhost:3000 npm run test:ci`

- How to add new tests and where to put them.
- Link to `CHANGELOG.md`.

---

## Commit messages (suggested)

- `chore(tests): detect stack and add recommended test tools`
- `chore(tests): add vitest/jest config and example unit tests`
- `chore(tests): add playwright config and example e2e tests`
- `ci: add test workflow`
- `docs: add TESTING.md and CHANGELOG.md`

---

## Edge cases Copilot must handle

- If a `start` script is missing, add instructions to `TESTING.md` explaining how to build and start the app for E2E tests (e.g., `npm run build && npm run start`).
- If monorepo detected: place tests in the appropriate package and add workspace-aware scripts.
- If repo uses Yarn Berry / pnpm, adapt install commands.
- If repository has an existing test framework, do **not** overwrite without migrating: add compatibility or migration steps and note in `CHANGELOG.md`.

---

## Final notes for Copilot

- Keep changes minimal and reversible: create commits per feature.
- Run tests locally after config changes — ensure Playwright browsers are installed with `npx playwright install`.
- Add clear human-readable messages in `CHANGELOG.md` and `TESTING.md`.
- When in doubt, prefer non-destructive changes and leave TODOs in `TESTING.md` for maintainers to pick up (e.g., "update baseURL for production/staging").

---

If you want, I can generate the exact contents for each file (config files, example tests, `TESTING.md`, `CHANGELOG.md`, CI workflow) tailored to the stack I infer — tell me whether to default to **Next.js + TypeScript**, **Vite + React + TypeScript**, or **plain Node + TypeScript**. If you prefer, I’ll assume Vite + React + TypeScript as a modern default and produce all files immediately.
