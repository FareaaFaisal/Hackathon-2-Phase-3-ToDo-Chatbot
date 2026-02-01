import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import ChatBot from '../../../src/components/tasks/ChatBot'; // Adjust path as needed
import * as chatApi from '../../../src/lib/chatApi'; // Import chatApi to mock it

// Mock the chatApi sendMessage
jest.mock('../../../src/lib/chatApi', () => ({
  sendMessage: jest.fn(),
}));

// Mock the auth hook
jest.mock('../../../src/lib/auth', () => ({
  useAuth: () => ({ userId: '1' }), // Provide a mock userId
}));


describe('ChatBot Initial Render', () => {
  beforeEach(() => {
    // Reset the mock before each test
    (chatApi.sendMessage as jest.Mock).mockReset();
  });

  test('renders with input field and send button when open', () => {
    render(<ChatBot isOpen={true} onClose={() => {}} userId="1" />);
    
    expect(screen.getByPlaceholderText(/type your message/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /send/i })).toBeInTheDocument();
  });

  test('does not render when closed', () => {
    const { container } = render(<ChatBot isOpen={false} onClose={() => {}} userId="1" />);
    
    expect(container).toBeEmptyDOMElement();
  });

  test('calls onClose when close button is clicked', () => {
    const handleClose = jest.fn();
    render(<ChatBot isOpen={true} onClose={handleClose} userId="1" />);
    
    const closeButton = screen.getByRole('button', { name: /close chat/i });
    fireEvent.click(closeButton);
    expect(handleClose).toHaveBeenCalledTimes(1);
  });
});


describe('ChatBot Conversation History Display (T020 - Integration)', () => {
    beforeEach(() => {
        // Reset the mock before each test
        (chatApi.sendMessage as jest.Mock).mockReset();
    });

    test('displays existing conversation history when provided', async () => {
        const mockHistory = [
            { sender: 'user', text: 'Hello AI' },
            { sender: 'ai', text: 'How can I help you today?' },
        ];
        // Mock sendMessage to simulate fetching history on first load
        (chatApi.sendMessage as jest.Mock).mockResolvedValueOnce({
            conversation_id: 1,
            response: 'First AI response',
            tool_calls: [],
            messages: mockHistory, // Simulate backend returning initial history
        });

        const { rerender } = render(<ChatBot isOpen={true} onClose={() => {}} userId="1" />);

        // Simulate initial load by passing messages to ChatBot
        rerender(<ChatBot isOpen={true} onClose={() => {}} userId="1" initialMessages={mockHistory} />);


        await waitFor(() => {
            expect(screen.getByText('Hello AI')).toBeInTheDocument();
            expect(screen.getByText('How can I help you today?')).toBeInTheDocument();
        });
    });

    test('displays new messages sent by user and AI response', async () => {
        (chatApi.sendMessage as jest.Mock).mockResolvedValueOnce({
            conversation_id: 1,
            response: 'Task added successfully!',
            tool_calls: [],
        });

        render(<ChatBot isOpen={true} onClose={() => {}} userId="1" />);

        const input = screen.getByPlaceholderText(/type your message/i);
        const sendButton = screen.getByRole('button', { name: /send/i });

        fireEvent.change(input, { target: { value: 'Add a new task' } });
        fireEvent.click(sendButton);

        await waitFor(() => {
            expect(screen.getByText('Add a new task')).toBeInTheDocument();
            expect(screen.getByText('Task added successfully!')).toBeInTheDocument();
        });

        expect(input).toHaveValue('');
    });

    test('displays "Thinking..." while waiting for AI response', async () => {
        // Mock sendMessage to return a promise that resolves after a delay
        (chatApi.sendMessage as jest.Mock).mockReturnValueOnce(new Promise(resolve => setTimeout(() => resolve({
            conversation_id: 1,
            response: 'Delayed AI response',
            tool_calls: [],
        }), 100)));

        render(<ChatBot isOpen={true} onClose={() => {}} userId="1" />);

        const input = screen.getByPlaceholderText(/type your message/i);
        const sendButton = screen.getByRole('button', { name: /send/i });

        fireEvent.change(input, { target: { value: 'Test thinking state' } });
        fireEvent.click(sendButton);

        expect(screen.getByText('Thinking...')).toBeInTheDocument();

        await waitFor(() => {
            expect(screen.queryByText('Thinking...')).not.toBeInTheDocument();
            expect(screen.getByText('Delayed AI response')).toBeInTheDocument();
        });
    });
});