import { test, expect } from '@playwright/test';

test.describe('Health Check Endpoints', () => {
  test('GET /api/health returns healthy status', async ({ request }) => {
    const response = await request.get('/api/health');

    expect(response.ok()).toBeTruthy();
    expect(response.status()).toBe(200);

    const data = await response.json();
    expect(data).toHaveProperty('status');
    expect(data).toHaveProperty('timestamp');
    expect(data).toHaveProperty('uptime');
    expect(data).toHaveProperty('checks');
    expect(data.checks).toHaveProperty('database');
    expect(data.checks).toHaveProperty('api');
    expect(data.checks.api.status).toBe('up');
  });

  test('GET /api/health/detailed returns detailed information', async ({ request }) => {
    const response = await request.get('/api/health/detailed');

    expect(response.status()).toBeLessThanOrEqual(503);

    const data = await response.json();
    expect(data).toHaveProperty('status');
    expect(data).toHaveProperty('memory');
    expect(data.memory).toHaveProperty('heapUsed');
    expect(data.memory).toHaveProperty('heapTotal');
    expect(data.checks.database).toHaveProperty('details');
  });

  test('GET /api/health/live always returns alive', async ({ request }) => {
    const response = await request.get('/api/health/live');

    expect(response.ok()).toBeTruthy();
    expect(response.status()).toBe(200);

    const data = await response.json();
    expect(data.status).toBe('alive');
    expect(data).toHaveProperty('timestamp');
  });

  test('GET /api/health/ready checks database readiness', async ({ request }) => {
    const response = await request.get('/api/health/ready');

    // Should be either 200 (ready) or 503 (not ready)
    expect([200, 503]).toContain(response.status());

    const data = await response.json();
    expect(data).toHaveProperty('status');
    expect(data).toHaveProperty('timestamp');

    if (response.status() === 200) {
      expect(data.status).toBe('ready');
    } else {
      expect(data.status).toBe('not ready');
      expect(data).toHaveProperty('reason');
    }
  });

  test('health check includes version and environment', async ({ request }) => {
    const response = await request.get('/api/health');
    const data = await response.json();

    expect(data).toHaveProperty('version');
    expect(data).toHaveProperty('environment');
    expect(['development', 'test', 'production']).toContain(data.environment);
  });

  test('database check includes response time', async ({ request }) => {
    const response = await request.get('/api/health');
    const data = await response.json();

    if (data.checks.database.status === 'up') {
      expect(data.checks.database).toHaveProperty('responseTime');
      expect(typeof data.checks.database.responseTime).toBe('number');
      expect(data.checks.database.responseTime).toBeGreaterThan(0);
    }
  });

  test('multiple rapid health checks should all succeed', async ({ request }) => {
    const promises = Array.from({ length: 5 }, () => request.get('/api/health/live'));

    const responses = await Promise.all(promises);

    responses.forEach(response => {
      expect(response.ok()).toBeTruthy();
    });
  });
});
