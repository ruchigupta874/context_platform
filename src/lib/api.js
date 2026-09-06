import { API_BASE } from './endpoints';

/**
 * Flip this to false once the backend exists. Every hook already goes through
 * `request`, so nothing above this file needs to change.
 */
export const USE_MOCKS = true;

/** Simulated latency for mock responses, so loading states are real code paths. */
const MOCK_DELAY_MS = 220;

export class ApiError extends Error {
  constructor(message, { status, url, body } = {}) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.url = url;
    this.body = body;
  }
}

/**
 * Resolve mock data with the same async signature the real call will have.
 * `signal` is honoured so aborted effects behave identically in both modes.
 */
export function mockRequest(data, { delay = MOCK_DELAY_MS, signal } = {}) {
  return new Promise((resolve, reject) => {
    if (signal?.aborted) {
      reject(new DOMException('Aborted', 'AbortError'));
      return;
    }
    const timer = setTimeout(() => resolve(structuredClone(data)), delay);
    signal?.addEventListener('abort', () => {
      clearTimeout(timer);
      reject(new DOMException('Aborted', 'AbortError'));
    });
  });
}

/**
 * The one place a network call is made. Handles base URL, JSON encoding,
 * error normalising and abort. Auth headers slot in here when they exist.
 */
export async function request(path, { method = 'GET', body, headers, signal } = {}) {
  const url = `${API_BASE}${path}`;

  const response = await fetch(url, {
    method,
    signal,
    headers: {
      Accept: 'application/json',
      ...(body ? { 'Content-Type': 'application/json' } : null),
      ...headers,
    },
    ...(body ? { body: JSON.stringify(body) } : null),
  });

  if (!response.ok) {
    let payload;
    try {
      payload = await response.json();
    } catch {
      payload = null;
    }
    throw new ApiError(payload?.message ?? `Request failed with ${response.status}`, {
      status: response.status,
      url,
      body: payload,
    });
  }

  if (response.status === 204) return null;
  return response.json();
}

export const api = {
  get: (path, options) => request(path, { ...options, method: 'GET' }),
  post: (path, body, options) => request(path, { ...options, method: 'POST', body }),
  patch: (path, body, options) => request(path, { ...options, method: 'PATCH', body }),
  delete: (path, options) => request(path, { ...options, method: 'DELETE' }),
};
