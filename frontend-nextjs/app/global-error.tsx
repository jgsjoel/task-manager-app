'use client';

// Required by Next.js to handle unrecoverable root-level errors.
// Must NOT use AuthProvider or any context-dependent components —
// this replaces the entire root layout when rendered.
export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body style={{ margin: 0, fontFamily: 'Arial, sans-serif', background: '#f3f4f6' }}>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '100vh',
            gap: '1rem',
          }}
        >
          <h2 style={{ color: '#111827', fontSize: '1.5rem', fontWeight: 'bold' }}>
            Something went wrong
          </h2>
          <button
            onClick={reset}
            style={{
              padding: '0.5rem 1.5rem',
              background: '#2563eb',
              color: '#fff',
              border: 'none',
              borderRadius: '0.5rem',
              cursor: 'pointer',
              fontSize: '1rem',
            }}
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}
