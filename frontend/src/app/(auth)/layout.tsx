// frontend/src/app/(auth)/layout.tsx
import React from 'react';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
      <div className="absolute inset-0 z-0 animated-gradient"></div>
      <main className="z-10 w-full max-w-md p-4">
        {children}
      </main>
    </div>
  );
}
