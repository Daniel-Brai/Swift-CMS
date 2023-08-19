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
      logging: true,
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
    azure: {
      blob: {
        storage_container_name: '',
        storage_account_name: '',
        storage_connection_string: '',
      },
    },
    mailer: {
      smtp: {
        host: '',
        port: 0,
        address: '',
        password: '',
      },
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
