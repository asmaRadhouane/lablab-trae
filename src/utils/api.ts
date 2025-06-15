import config from '@/config';

interface FetchOptions extends RequestInit {
  retries?: number;
}

class ApiError extends Error {
  constructor(
    message: string,
    public status?: number,
    public data?: any
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

async function fetchWithRetry(
  url: string,
  options: FetchOptions = {}
): Promise<Response> {
  const { retries = config.maxRetries, ...fetchOptions } = options;
  
  try {
    const response = await fetch(url, fetchOptions);
    if (!response.ok) {
      throw new ApiError(
        `HTTP error! status: ${response.status}`,
        response.status,
        await response.json().catch(() => null)
      );
    }
    return response;
  } catch (error) {
    if (retries > 0) {
      await new Promise(resolve => setTimeout(resolve, config.retryDelay));
      return fetchWithRetry(url, { ...options, retries: retries - 1 });
    }
    throw error;
  }
}

export async function get<T>(endpoint: string, options: FetchOptions = {}): Promise<T> {
  const url = `${config.apiBaseUrl}${endpoint}`;
  const response = await fetchWithRetry(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });
  return response.json();
}

export async function post<T>(endpoint: string, data: any, options: FetchOptions = {}): Promise<T> {
  const url = `${config.apiBaseUrl}${endpoint}`;
  const response = await fetchWithRetry(url, {
    ...options,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    body: JSON.stringify(data),
  });
  return response.json();
}

export async function triggerN8nWorkflow(data: any): Promise<void> {
  if (!config.n8nWebhookUrl) {
    throw new Error('N8N webhook URL is not configured');
  }

  await post(config.n8nWebhookUrl, data);
}

export function buildQueryString(params: Record<string, string | number | boolean | undefined>): string {
  const searchParams = new URLSearchParams();
  
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined) {
      searchParams.append(key, String(value));
    }
  });
  
  const queryString = searchParams.toString();
  return queryString ? `?${queryString}` : '';
}