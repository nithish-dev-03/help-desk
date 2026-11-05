import { AppApiError } from './errors';
import { ApiResponse } from '@/types/api';

// Keep browser requests same-origin in development so the Vite proxy carries
// the session cookie consistently. An absolute URL can still be supplied for
// deployments that serve the API from a separate origin.
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

export interface RequestOptions extends RequestInit {
  params?: Record<string, string | number | boolean | undefined>;
}

export async function apiClient<T>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<T> {
  const { params, headers, ...customConfig } = options;

  let url = endpoint.startsWith('http')
    ? endpoint
    : `${API_BASE_URL ? API_BASE_URL : ''}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

  if (params) {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        searchParams.append(key, String(value));
      }
    });
    const queryString = searchParams.toString();
    if (queryString) {
      url += (url.includes('?') ? '&' : '?') + queryString;
    }
  }

  const defaultHeaders: HeadersInit = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  };

  const config: RequestInit = {
    method: options.method || 'GET',
    headers: {
      ...defaultHeaders,
      ...headers,
    },
    credentials: 'include', // Mandated by backend session cookies
    ...customConfig,
  };

  let response: Response;
  try {
    response = await fetch(url, config);
  } catch (err) {
    throw new AppApiError(
      0,
      err instanceof Error ? err.message : 'Network request failed. Is the server running?'
    );
  }

  let data: ApiResponse<T> | T | null = null;
  const contentType = response.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    try {
      data = await response.json();
    } catch {
      data = null;
    }
  } else {
    const text = await response.text();
    if (!response.ok) {
      throw new AppApiError(response.status, text || response.statusText);
    }
    return text as unknown as T;
  }

  // Handle backend envelope { status: false, error: { code, message } }
  if (data && typeof data === 'object' && 'status' in data && data.status === false) {
    const errorEnvelope = (data as ApiResponse).error;
    const message =
      errorEnvelope?.message ||
      (data as { message?: string; Message?: string }).message ||
      (data as { message?: string; Message?: string }).Message ||
      'Request failed';
    throw new AppApiError(response.status, message, errorEnvelope?.code, errorEnvelope?.fields);
  }

  if (!response.ok) {
    if (
      response.status === 401 &&
      !endpoint.includes('/auth/login') &&
      !endpoint.includes('/auth/me')
    ) {
      window.dispatchEvent(new Event('auth:unauthorized'));
    }
    const errObj = data as { detail?: string; message?: string } | null;
    const msg = errObj?.detail || errObj?.message || response.statusText;
    throw new AppApiError(response.status, msg);
  }

  return data as T;
}
