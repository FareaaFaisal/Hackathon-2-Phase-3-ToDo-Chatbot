import { getAuthToken } from './auth';

export interface ChatResponse {
  conversation_id: number;
  response: string;
  tool_calls?: Array<{ tool_name: string; args: Record<string, any> }>;
}

export async function sendMessage(
  message: string,
  conversationId?: number
): Promise<ChatResponse> {
  const token = getAuthToken();

  const res = await fetch('http://localhost:8000/api/v1/chat', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify({
      message,
      conversation_id: conversationId,
    }),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.detail || 'Chat failed');
  }

  return res.json();
}
