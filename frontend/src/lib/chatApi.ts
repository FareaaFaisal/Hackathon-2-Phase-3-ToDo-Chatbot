// frontend/src/lib/api.ts
import { getAuthToken, removeAuthToken } from './auth';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

interface RequestOptions extends Omit<RequestInit, 'body'> {
  method?: HttpMethod;
  body?: unknown; // Can be any type, JSON.stringified
}

async function apiRequest<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
  const token = getAuthToken();

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const config: RequestInit = {
    ...options,
    headers,
    body: options.body ? JSON.stringify(options.body) : undefined,
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

  // Handle unauthorized
  if (response.status === 401) {
    removeAuthToken();
    throw new Error('Unauthorized: Session expired or invalid token.');
  }

  // Handle other errors
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: response.statusText }));
    throw new Error(errorData.message || 'Something went wrong with the API request.');
  }

  // Handle DELETE or No Content responses
  if (response.status === 204) {
    return undefined as unknown as T; // No JSON body
  }

  // Parse JSON for normal responses
  return response.json() as Promise<T>;
}

export const api = {
  get: <T>(endpoint: string, options?: Omit<RequestOptions, 'method' | 'body'>) =>
    apiRequest<T>(endpoint, { method: 'GET', ...options }),

  post: <T>(endpoint: string, body: unknown, options?: Omit<RequestOptions, 'method' | 'body'>) =>
    apiRequest<T>(endpoint, { method: 'POST', body, ...options }),

  put: <T>(endpoint: string, body: unknown, options?: Omit<RequestOptions, 'method' | 'body'>) =>
    apiRequest<T>(endpoint, { method: 'PUT', body, ...options }),

  del: <T>(endpoint: string, options?: Omit<RequestOptions, 'method' | 'body'>) =>
    apiRequest<T>(endpoint, { method: 'DELETE', ...options }),
};