'use client';
import React, { useState, useEffect, useRef } from 'react';
import { sendMessage } from '../../lib/chatApi'; // Adjust path if needed
import { useAuth } from '../../hooks/useAuth';

interface ChatBotProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Message {
  sender: 'user' | 'ai';
  text: string;
  tool_calls?: Array<{ tool_name: string; args: Record<string, any> }>;
}

const ChatBot: React.FC<ChatBotProps> = ({ isOpen, onClose }) => {
  const { isAuthenticated, userId } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [conversationId, setConversationId] = useState<number | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  if (!isOpen) return null;

  if (!isAuthenticated || !userId) {
    return (
      <div className="fixed bottom-20 right-4 w-80 h-32 bg-white rounded-lg shadow-lg flex flex-col justify-center items-center z-50">
        <p className="text-gray-700 text-center px-4">Please log in to use the AI Chatbot.</p>
        <button onClick={onClose} className="mt-2 text-blue-500 hover:text-blue-700">Close</button>
      </div>
    );
  }

  const handleSendMessage = async () => {
    if (inputMessage.trim() === '' || isLoading) return;

    const userMessage: Message = { sender: 'user', text: inputMessage };
    setMessages((prev) => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const response = await sendMessage(inputMessage, conversationId);

      setConversationId(response.conversation_id);

      const aiMessage: Message = {
        sender: 'ai',
        text: response.response,
        tool_calls: response.tool_calls,
      };
      setMessages((prev) => [...prev, aiMessage]);
    } catch (error: any) {
      const errorMessage: Message = {
        sender: 'ai',
        text: `Error: ${error.message || 'Unknown error occurred.'}`,
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleSendMessage();
  };

  return (
    <div className="fixed bottom-20 right-4 w-80 h-96 bg-white rounded-lg shadow-lg flex flex-col z-50">
      <div className="flex justify-between items-center p-3 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-700">AI Todo Chatbot</h3>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
          X
        </button>
      </div>
      <div className="flex-1 p-3 overflow-y-auto">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex mb-2 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[70%] p-2 rounded-lg ${msg.sender === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'}`}>
              {msg.text}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start mb-2">
            <div className="max-w-[70%] p-2 rounded-lg bg-gray-200 text-gray-800">Thinking...</div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      <div className="p-3 border-t border-gray-200 flex">
        <input
          type="text"
          className="flex-1 border border-gray-300 rounded-l-lg p-2 focus:outline-none text-black"
          placeholder="Type your message..."
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          disabled={isLoading}
        />
        <button
          onClick={handleSendMessage}
          className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-r-lg"
          disabled={isLoading}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatBot;
