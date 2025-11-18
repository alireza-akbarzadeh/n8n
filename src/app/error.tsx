'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import * as Sentry from '@sentry/nextjs';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log to console
    console.error('Application error:', error);

    // Send to Sentry
    Sentry.captureException(error, {
      tags: {
        errorBoundary: 'app',
      },
      contexts: {
        errorInfo: {
          digest: error.digest,
          message: error.message,
        },
      },
    });
  }, [error]);

  return (
    <div className="bg-background flex min-h-screen items-center justify-center p-4">
      <div className="mx-auto max-w-2xl text-center">
        <div className="mb-8">
          <div className="text-6xl">⚠️</div>
        </div>
        <h2 className="mb-4 text-3xl font-semibold tracking-tight">Something went wrong!</h2>
        <p className="text-muted-foreground mb-2 text-lg">
          {error.message || 'An unexpected error occurred'}
        </p>
        {error.digest && (
          <p className="text-muted-foreground mb-8 font-mono text-sm">Error ID: {error.digest}</p>
        )}
        <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
          <Button onClick={() => reset()} size="lg">
            Try again
          </Button>
          <Button onClick={() => (window.location.href = '/')} variant="outline" size="lg">
            Go home
          </Button>
        </div>
      </div>
    </div>
  );
}
