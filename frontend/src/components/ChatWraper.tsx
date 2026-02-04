// frontend/src/components/ChatWrapper.tsx
'use client';

import React, { useState } from 'react';
import ChatIcon from './common/ChatIcon';
import ChatBot from './tasks/ChatBot';
import { useAuth } from '../hooks/useAuth';

export default function ChatWrapper() {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) return null;

  return (
    <>
      <ChatIcon onClick={() => setIsChatOpen(!isChatOpen)} isOpen={isChatOpen} />
      <ChatBot isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
    </>
  );
}
