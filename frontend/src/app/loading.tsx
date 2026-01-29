// frontend/src/app/loading.tsx
import React from 'react';
import Spinner from '@/components/common/Spinner';

export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <Spinner size="lg" color="text-blue-600" />
      <p className="mt-4 text-gray-700 text-lg">Loading...</p>
    </div>
  );
}
