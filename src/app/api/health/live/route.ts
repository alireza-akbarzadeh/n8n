import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

/**
 * Liveness probe - checks if the application is running
 * Returns 200 if the process is alive
 */
export async function GET() {
  return NextResponse.json(
    {
      status: 'alive',
      timestamp: new Date().toISOString(),
    },
    { status: 200 }
  );
}
