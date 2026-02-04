'use client';

import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import React, { useState } from 'react';
import ChatIcon from '../components/common/ChatIcon';
import ChatBot from '../components/tasks/ChatBot';
import { useAuth } from '../hooks/useAuth';

const geistSans = Geist({ variable: '--font-geist-sans', subsets: ['latin'] });
const geistMono = Geist_Mono({ variable: '--font-geist-mono', subsets: ['latin'] });

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const { isAuthenticated } = useAuth();

  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {children}

        {isAuthenticated && (
          <>
            <ChatIcon onClick={() => setIsChatOpen(!isChatOpen)} isOpen={isChatOpen} />
            <ChatBot isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
          </>
        )}
      </body>
    </html>
  );
}
