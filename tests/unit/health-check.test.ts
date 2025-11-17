import { describe, it, expect, beforeAll, afterAll, vi } from 'vitest';
import { GET } from '@/app/api/health/route';

// Mock Prisma
vi.mock('@/lib/db', () => ({
  default: {
    $queryRaw: vi.fn(),
  },
}));

describe('Health Check API', () => {
  beforeAll(() => {
    vi.stubEnv('NODE_ENV', 'test');
    vi.stubEnv('npm_package_version', '0.1.0');
  });

  afterAll(() => {
    vi.unstubAllEnvs();
  });

  it('returns healthy status when database is accessible', async () => {
    const prisma = await import('@/lib/db');
    vi.mocked(prisma.default.$queryRaw).mockResolvedValueOnce([{ '?column?': 1 }]);

    const response = await GET();
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.status).toBe('healthy');
    expect(data.checks.database.status).toBe('up');
    expect(data.checks.api.status).toBe('up');
    expect(data).toHaveProperty('timestamp');
    expect(data).toHaveProperty('uptime');
  });

  it('returns unhealthy status when database is down', async () => {
    const prisma = await import('@/lib/db');
    vi.mocked(prisma.default.$queryRaw).mockRejectedValueOnce(new Error('Connection refused'));

    const response = await GET();
    const data = await response.json();

    expect(response.status).toBe(503);
    expect(data.status).toBe('unhealthy');
    expect(data.checks.database.status).toBe('down');
    expect(data.checks.database.error).toContain('Connection refused');
  });

  it('includes version and environment information', async () => {
    const prisma = await import('@/lib/db');
    vi.mocked(prisma.default.$queryRaw).mockResolvedValueOnce([{ '?column?': 1 }]);

    const response = await GET();
    const data = await response.json();

    expect(data.version).toBe('0.1.0');
    expect(data.environment).toBe('test');
  });

  it('includes database response time', async () => {
    const prisma = await import('@/lib/db');

    // Simulate a delayed database response
    vi.mocked(prisma.default.$queryRaw).mockResolvedValueOnce([{ '?column?': 1 }]);

    const response = await GET();
    const data = await response.json();

    expect(data.checks.database).toHaveProperty('responseTime');
    expect(typeof data.checks.database.responseTime).toBe('number');
  });
});
