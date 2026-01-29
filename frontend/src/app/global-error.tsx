// frontend/src/app/global-error.tsx
'use client';

import { useEffect } from 'react';
import Button from '@/components/common/Button';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Global Error:', error);
  }, [error]);

  return (
    <html lang="en">
      <body>
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
          <h2 className="text-3xl font-bold text-red-700 mb-4">Oops, something went catastrophically wrong!</h2>
          <p className="text-gray-800 mb-6 text-center">
            We apologize for the inconvenience. Please try again.
          </p>
          <p className="text-gray-600 mb-6 text-center text-sm">
            {error.message || 'An unhandled application error occurred.'}
          </p>
          <Button
            variant="primary"
            onClick={
              // Attempt to recover by trying to re-render the segment
              () => reset()
            }
          >
            Try again
          </Button>
          {error.digest && (
            <p className="mt-4 text-sm text-gray-500">Error ID: {error.digest}</p>
          )}
        </div>
      </body>
    </html>
  );
}
