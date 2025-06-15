interface Config {
  apiBaseUrl: string;
  n8nWebhookUrl: string;
  maxRetries: number;
  retryDelay: number;
  analyticsEnabled: boolean;
}

const development: Config = {
  apiBaseUrl: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000',
  n8nWebhookUrl: process.env.N8N_WEBHOOK_URL || '',
  maxRetries: 3,
  retryDelay: 1000,
  analyticsEnabled: true
};

const production: Config = {
  apiBaseUrl: process.env.NEXT_PUBLIC_API_BASE_URL || '',
  n8nWebhookUrl: process.env.N8N_WEBHOOK_URL || '',
  maxRetries: 3,
  retryDelay: 2000,
  analyticsEnabled: true
};

const test: Config = {
  apiBaseUrl: 'http://localhost:3000',
  n8nWebhookUrl: 'http://localhost:5678/webhook-test',
  maxRetries: 0,
  retryDelay: 0,
  analyticsEnabled: false
};

const config: Record<string, Config> = {
  development,
  production,
  test
};

const environment = process.env.NODE_ENV || 'development';

export default config[environment];