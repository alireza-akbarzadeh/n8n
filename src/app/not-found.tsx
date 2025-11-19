'use client';
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="bg-background flex min-h-screen items-center justify-center p-4">
      <div className="mx-auto max-w-2xl text-center">
        <div className="mb-8">
          <h1 className="text-primary text-9xl font-bold">404</h1>
        </div>
        <h2 className="mb-4 text-3xl font-semibold tracking-tight">Page Not Found</h2>
        <p className="text-muted-foreground mb-8 text-lg">
          Sorry, we couldn&apos;t find the page you&apos;re looking for. The page might have been
          moved, deleted, or never existed.
        </p>
        <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
          <Link
            href="/workflows"
            className="bg-primary text-primary-foreground hover:bg-primary/90 focus-visible:ring-ring inline-flex h-11 items-center justify-center rounded-md px-8 text-sm font-medium shadow transition-colors focus-visible:ring-1 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50"
          >
            Go to Workflows
          </Link>
          <button
            onClick={() => window.history.back()}
            className="border-input bg-background hover:bg-accent hover:text-accent-foreground focus-visible:ring-ring inline-flex h-11 items-center justify-center rounded-md border px-8 text-sm font-medium shadow-sm transition-colors focus-visible:ring-1 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50"
          >
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
}
