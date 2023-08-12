import { ConfigData } from './config.interface';

export const DEFAULT_CONFIG: ConfigData = {
  environment: {
    port: Number(process.env.PORT || 8000),
    type: 'production',
  }, 
  services: {
    database: {
      host: '',
      port: 5432,
      username: '',
      password: '',
      name: '',
      url: '',
    },
    redis: {
      host: '',
      port: 6379,
      username: '',
      password: '',
      name: '',
      url: '',
    },
    cloudinary: {
      name: '',
      api_key: '',
      secret_key: '',
    },
  }, 
  authentication: {
    expiresIn: 30000,
    access_token_secret: '',
    refresh_token_secret: '',
    google: {
      oauth_google_client_id: '',
      oauth_callback: '',
      oauth_google_secret_key: '',
    },
    github: {
      oauth_github_client_id: '',
      oauth_callback: '',
      oauth_github_secret_key: '',
    },
  },
};
