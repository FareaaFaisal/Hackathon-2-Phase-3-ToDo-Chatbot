import React from 'react';

interface ChatIconProps {
  onClick: () => void;
  isOpen: boolean;
}

const ChatIcon: React.FC<ChatIconProps> = ({ onClick, isOpen }) => {
  return (
    <button
      data-testid="chat-icon"
      className={`fixed bottom-4 right-4 bg-pink-500 hover:bg-pink-600 text-black p-3 rounded-full shadow-lg transition-all duration-300 ${
        isOpen ? 'rotate-45' : ''
      }`}
      onClick={onClick}
      aria-label={isOpen ? 'Close chat' : 'Open chat'}
    >
      {isOpen ? (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      ) : (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
          />
        </svg>
      )}
    </button>
  );
};

export default ChatIcon;
