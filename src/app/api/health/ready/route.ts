import { NextResponse } from 'next/server';
import prisma from '@/shared/infrastructure/database/db';

export const dynamic = 'force-dynamic';

/**
 * Readiness probe - checks if the application is ready to serve traffic
 * Returns 200 only if database is accessible
 */
export async function GET() {
  try {
    // Quick database check
    await prisma.$queryRaw`SELECT 1`;

    return NextResponse.json(
      {
        status: 'ready',
        timestamp: new Date().toISOString(),
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        status: 'not ready',
        reason: 'database unavailable',
        timestamp: new Date().toISOString(),
      },
      { status: 503 }
    );
  }
}
