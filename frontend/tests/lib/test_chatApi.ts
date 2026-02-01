import { sendMessage } from '../../../src/lib/chatApi'; // Adjust path as needed

describe('chatApi', () => {
  const MOCK_API_URL = 'http://localhost:8000/api'; // Define the mock API URL

  // Patch NEXT_PUBLIC_API_URL for testing
  let originalEnv: NodeJS.ProcessEnv;

  beforeAll(() => {
    originalEnv = process.env;
    process.env = { ...originalEnv, NEXT_PUBLIC_API_URL: MOCK_API_URL };
  });

  afterAll(() => {
    process.env = originalEnv;
  });


  const USER_ID = '123';

  beforeEach(() => {
    // Mock the global fetch function
    global.fetch = jest.fn((input: RequestInfo | URL, init?: RequestInit) =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({
          conversation_id: 1,
          response: 'AI response from mock',
          tool_calls: [],
        }),
      } as Response)
    );
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('sendMessage sends a new message and returns correct data', async () => {
    const message = 'Hello AI';
    const result = await sendMessage(USER_ID, message);

    expect(global.fetch).toHaveBeenCalledTimes(1);
    expect(global.fetch).toHaveBeenCalledWith(
      `${MOCK_API_URL}/${USER_ID}/chat`,
      expect.objectContaining({
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message }),
      })
    );

    expect(result).toEqual({
      conversation_id: 1,
      response: 'AI response from mock',
      tool_calls: [],
    });
  });

  test('sendMessage sends a message with existing conversationId', async () => {
    const message = 'How are you?';
    const conversationId = 5;
    const result = await sendMessage(USER_ID, message, conversationId);

    expect(global.fetch).toHaveBeenCalledTimes(1);
    expect(global.fetch).toHaveBeenCalledWith(
      `${MOCK_API_URL}/${USER_ID}/chat`,
      expect.objectContaining({
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message, conversation_id: conversationId }),
      })
    );

    expect(result).toEqual({
      conversation_id: 1,
      response: 'AI response from mock',
      tool_calls: [],
    });
  });

  test('sendMessage handles API errors', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: false,
        status: 500,
        json: () => Promise.resolve({ detail: 'Internal Server Error' }),
      } as Response)
    );

    await expect(sendMessage(USER_ID, 'Test error')).rejects.toThrow('Failed to send message: 500');
  });
});
