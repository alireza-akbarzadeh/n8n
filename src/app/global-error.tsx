'use client';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  // Log error (Sentry auto-captures in production via instrumentation)
  if (typeof window !== 'undefined') {
    console.error('Global error:', error);
  }

  return (
    <html lang="en">
      <body style={{ fontFamily: 'system-ui, sans-serif' }}>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '100vh',
            padding: '2rem',
            backgroundColor: '#fafafa',
          }}
        >
          <div
            style={{
              maxWidth: '600px',
              width: '100%',
              backgroundColor: 'white',
              borderRadius: '12px',
              padding: '3rem 2rem',
              boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
              textAlign: 'center',
            }}
          >
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⚠️</div>
            <h2
              style={{
                fontSize: '1.5rem',
                fontWeight: '600',
                marginBottom: '1rem',
                color: '#171717',
              }}
            >
              Something went wrong!
            </h2>
            <p
              style={{
                marginBottom: '0.5rem',
                color: '#525252',
                lineHeight: '1.5',
              }}
            >
              {error.message || 'An unexpected error occurred'}
            </p>
            {error.digest && (
              <p
                style={{
                  fontSize: '0.875rem',
                  color: '#a3a3a3',
                  marginBottom: '2rem',
                  fontFamily: 'monospace',
                }}
              >
                Error ID: {error.digest}
              </p>
            )}
            <div
              style={{
                display: 'flex',
                gap: '1rem',
                justifyContent: 'center',
                marginTop: '2rem',
              }}
            >
              <button
                onClick={() => reset()}
                style={{
                  padding: '0.75rem 1.5rem',
                  background: '#0070f3',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '1rem',
                  fontWeight: '500',
                  transition: 'background 0.2s',
                }}
              >
                Try again
              </button>
              <a
                href="/"
                style={{
                  padding: '0.75rem 1.5rem',
                  background: '#f5f5f5',
                  color: '#171717',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '1rem',
                  fontWeight: '500',
                  textDecoration: 'none',
                  display: 'inline-block',
                }}
              >
                Go home
              </a>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
