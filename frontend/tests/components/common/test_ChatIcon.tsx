import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import ChatIcon from '../../../src/components/common/ChatIcon'; // Adjust path as needed

describe('ChatIcon', () => {
  test('renders the chat icon', () => {
    render(<ChatIcon onClick={() => {}} />);
    const chatIcon = screen.getByTestId('chat-icon'); // Assuming a data-testid="chat-icon" will be added
    expect(chatIcon).toBeInTheDocument();
  });

  test('calls onClick handler when clicked', () => {
    const handleClick = jest.fn();
    render(<ChatIcon onClick={handleClick} />);
    const chatIcon = screen.getByTestId('chat-icon');
    fireEvent.click(chatIcon);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
