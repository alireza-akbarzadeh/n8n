import { NextResponse } from 'next/server';
import prisma from '@/shared/infrastructure/database/db';

export const dynamic = 'force-dynamic';

interface DetailedHealthCheck {
  status: 'healthy' | 'unhealthy' | 'degraded';
  timestamp: string;
  uptime: number;
  checks: {
    database: {
      status: 'up' | 'down';
      responseTime?: number;
      error?: string;
      details?: {
        userCount?: number;
        workflowCount?: number;
      };
    };
    trpc: {
      status: 'up' | 'down';
      error?: string;
    };
    api: {
      status: 'up';
    };
  };
  version?: string;
  environment?: string;
  memory?: {
    heapUsed: number;
    heapTotal: number;
    external: number;
    rss: number;
  };
}

export async function GET() {
  const timestamp = new Date().toISOString();

  const healthCheck: DetailedHealthCheck = {
    status: 'healthy',
    timestamp,
    uptime: process.uptime(),
    checks: {
      database: {
        status: 'down',
      },
      trpc: {
        status: 'up',
      },
      api: {
        status: 'up',
      },
    },
    version: process.env.npm_package_version || '0.1.0',
    environment: process.env.NODE_ENV || 'development',
    memory: {
      heapUsed: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
      heapTotal: Math.round(process.memoryUsage().heapTotal / 1024 / 1024),
      external: Math.round(process.memoryUsage().external / 1024 / 1024),
      rss: Math.round(process.memoryUsage().rss / 1024 / 1024),
    },
  };

  // Check database connection with detailed info
  try {
    const dbStartTime = Date.now();

    // Basic connection test
    await prisma.$queryRaw`SELECT 1`;

    // Get counts for key tables
    const [userCount, workflowCount] = await Promise.all([
      prisma.user.count().catch(() => 0),
      prisma.workflow.count().catch(() => 0),
    ]);

    const dbResponseTime = Date.now() - dbStartTime;

    healthCheck.checks.database = {
      status: 'up',
      responseTime: dbResponseTime,
      details: {
        userCount,
        workflowCount,
      },
    };
  } catch (error) {
    healthCheck.status = 'unhealthy';
    healthCheck.checks.database = {
      status: 'down',
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }

  // Check tRPC endpoint availability
  try {
    const trpcUrl = new URL('/api/trpc', process.env.NEXTAUTH_URL || 'http://localhost:3000');
    const response = await fetch(trpcUrl.toString(), {
      method: 'HEAD',
    }).catch(() => null);

    if (!response || response.status >= 500) {
      healthCheck.checks.trpc = {
        status: 'down',
        error: 'tRPC endpoint unreachable',
      };
      healthCheck.status = 'degraded';
    }
  } catch (error) {
    healthCheck.checks.trpc = {
      status: 'down',
      error: error instanceof Error ? error.message : 'Unknown error',
    };
    healthCheck.status = 'degraded';
  }

  // Determine overall status
  if (healthCheck.checks.database.status === 'down') {
    healthCheck.status = 'unhealthy';
  } else if (healthCheck.checks.trpc.status === 'down' && healthCheck.status === 'healthy') {
    healthCheck.status = 'degraded';
  }

  const statusCode =
    healthCheck.status === 'healthy' ? 200 : healthCheck.status === 'degraded' ? 200 : 503;

  return NextResponse.json(healthCheck, { status: statusCode });
}
