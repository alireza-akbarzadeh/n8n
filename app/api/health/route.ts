import { NextResponse } from 'next/server';
import prisma from '@/lib/db';

export const dynamic = 'force-dynamic';

interface HealthCheckResult {
  status: 'healthy' | 'unhealthy' | 'degraded';
  timestamp: string;
  uptime: number;
  checks: {
    database: {
      status: 'up' | 'down';
      responseTime?: number;
      error?: string;
    };
    api: {
      status: 'up';
    };
  };
  version?: string;
  environment?: string;
}

export async function GET() {
  const timestamp = new Date().toISOString();

  const healthCheck: HealthCheckResult = {
    status: 'healthy',
    timestamp,
    uptime: process.uptime(),
    checks: {
      database: {
        status: 'down',
      },
      api: {
        status: 'up',
      },
    },
    version: process.env.npm_package_version || '0.1.0',
    environment: process.env.NODE_ENV || 'development',
  };

  // Check database connection
  try {
    const dbStartTime = Date.now();
    await prisma.$queryRaw`SELECT 1`;
    const dbResponseTime = Date.now() - dbStartTime;

    healthCheck.checks.database = {
      status: 'up',
      responseTime: dbResponseTime,
    };
  } catch (error) {
    healthCheck.status = 'unhealthy';
    healthCheck.checks.database = {
      status: 'down',
      error: error instanceof Error ? error.message : 'Unknown error',
    };

    // Return 503 Service Unavailable if database is down
    return NextResponse.json(healthCheck, { status: 503 });
  }

  // Determine overall status
  if (healthCheck.checks.database.status === 'down') {
    healthCheck.status = 'unhealthy';
  }

  const statusCode = healthCheck.status === 'healthy' ? 200 : 503;

  return NextResponse.json(healthCheck, { status: statusCode });
}
