// frontend/src/app/error.tsx
'use client'; // Error components must be Client Components

import { useEffect } from 'react';
import Button from '@/components/common/Button';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
      <h2 className="text-2xl font-bold text-red-600 mb-4">Something went wrong!</h2>
      <p className="text-gray-700 mb-6 text-center">
        {error.message || 'An unexpected error occurred.'}
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
  );
}
