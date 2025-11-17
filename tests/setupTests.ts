import '@testing-library/jest-dom';
import { afterAll, afterEach, beforeAll } from 'vitest';
import { server } from './mocks/server';

// Establish API mocking before all tests
beforeAll(() => server.listen({ onUnhandledRequest: 'warn' }));

// Reset any request handlers that are declared as runtime overrides
afterEach(() => server.resetHandlers());

// Clean up after the tests are finished
afterAll(() => server.close());
