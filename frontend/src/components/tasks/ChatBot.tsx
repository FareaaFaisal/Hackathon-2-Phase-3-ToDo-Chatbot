'use client';

import React, { useState, useEffect, useRef } from 'react';
import { sendMessage } from '../../lib/chatApi';

interface ChatBotProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Message {
  sender: 'user' | 'ai';
  text: string;
}

const ChatBot: React.FC<ChatBotProps> = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [conversationId, setConversationId] = useState<number>();
  const [isLoading, setIsLoading] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (!isOpen) return null;

  const send = async () => {
    if (!inputMessage.trim()) return;

    setMessages(m => [...m, { sender: 'user', text: inputMessage }]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const res = await sendMessage(inputMessage, conversationId);
      setConversationId(res.conversation_id);
      setMessages(m => [...m, { sender: 'ai', text: res.response }]);
    } catch (e: any) {
      setMessages(m => [...m, { sender: 'ai', text: e.message }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-20 right-4 w-80 h-96 bg-white rounded-lg shadow-lg flex flex-col z-50">
      <div className="p-3 border-b flex justify-between">
        <b className='text-black'>AI Todo Chatbot</b>
        <button onClick={onClose}>✕</button>
      </div>

      <div className="flex-1 p-3 overflow-y-auto">
        {messages.map((m, i) => (
          <div key={i} className={m.sender === 'user' ? 'text-right' : 'text-left'}>
            <div className="inline-block bg-blue-400 p-2 rounded my-1 text-white">
              {m.text}
            </div>
          </div>
        ))}
        {isLoading && <div className="text-gray-500 bg-blue-400 rounded-lg">Thinking...</div>}
        <div ref={endRef} />
      </div>

      <div className="p-3 border-t flex">
        <input
          value={inputMessage}
          onChange={e => setInputMessage(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && send()}
          className="flex-1 border p-2 text-black rounded-l"
        />
        <button onClick={send} className="bg-blue-500 text-white px-3">
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatBot;
