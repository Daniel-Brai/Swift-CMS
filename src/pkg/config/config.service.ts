import { Injectable } from '@nestjs/common';
import { DEFAULT_CONFIG } from './config.default';
import {
  ConfigData,
  ServicesConfig,
  AuthConfig,
  NodeEnvironmentConfig,
} from './config.interface';
import { config } from 'dotenv';

// auto load envs into config service
config();

/**
 * Provides an adaptable environment configuration extension
 */

@Injectable()
export class ConfigService {
  private config: ConfigData;
  constructor(data: ConfigData = DEFAULT_CONFIG) {
    this.config = data;
  }

  public loadFromEnv() {
    this.config = this.parseConfigFromEnv(process.env);
  }

  private parseConfigFromEnv(env: NodeJS.ProcessEnv): ConfigData {
    return {
      environment: this.parseNodeEnvironmentConfig(
        env,
        DEFAULT_CONFIG.environment,
      ),
      services: this.parseServicesConfig(env, DEFAULT_CONFIG.services),
      authentication: this.parseAuthenticationConfig(
        env,
        DEFAULT_CONFIG.authentication,
      ),
    };
  }

  private parseNodeEnvironmentConfig(
    env: NodeJS.ProcessEnv,
    defaultConfig: Readonly<NodeEnvironmentConfig>,
  ): NodeEnvironmentConfig {
    return {
      type: env.NODE_ENV! || defaultConfig.type,
      port: Number(env.PORT!) || defaultConfig.port,
    };
  }

  private parseServicesConfig(
    env: NodeJS.ProcessEnv,
    defaultConfig: Readonly<ServicesConfig>,
  ): ServicesConfig {
    return {
      database: {
        host: env.DATABASE_HOST! || defaultConfig.database.host,
        port: Number(env.DATABASE_PORT!) || defaultConfig.database.port,
        username: env.DATABASE_USERNAME! || defaultConfig.database.username,
        password: env.DATABASE_PASSWORD! || defaultConfig.database.password,
        name: env.DATABASE_NAME! || defaultConfig.database.name,
        url: env.DATABASE_URL! || defaultConfig.database.url,
      },
      redis: {
        host: env.REDIS_HOST! || defaultConfig.redis.host,
        port: Number(env.REDIS_PORT!) || defaultConfig.redis.port,
        username: env.REDIS_USERNAME! || defaultConfig.redis.username,
        password: env.REDIS_PASSWORD! || defaultConfig.redis.password,
        name: env.REDIS_NAME! || defaultConfig.redis.name,
        url: env.REDIS_URL! || defaultConfig.redis.url,
      },
      cloudinary: {
        name: env.CLOUDINARY_CLOUD_NAME! || defaultConfig.cloudinary.name,
        api_key: env.CLOUDINARY_API_KEY! || defaultConfig.cloudinary.api_key,
        secret_key:
          env.CLOUDINARY_SECRET_KEY! || defaultConfig.cloudinary.secret_key,
      },
    };
  }

  private parseAuthenticationConfig(
    env: NodeJS.ProcessEnv,
    defaultConfig: Readonly<AuthConfig>,
  ): AuthConfig {
    return {
      expiresIn: Number(env.TOKEN_EXPIRY),
      access_token_secret: env.JWT_ACCESS_TOKEN_SECRET!,
      refresh_token_secret: env.JWT_REFRESH_TOKEN_SECRET!,
      google: {
        oauth_google_client_id: env.OAUTH_GOOGLE_ID!,
        oauth_callback: env.OAUTH_GOOGLE_REDIRECT_URL!,
        oauth_google_secret: env.OAUTH_GOOGLE_SECRET!,
      },
      github: {
        oauth_github_client_id: env.OAUTH_GITHUB_ID!,
        oauth_callback: env.OAUTH_GITHUB_REDIRECT_URL!,
        oauth_github_secret: env.OAUTH_GITHUB_SECRET!,
      },
    };
  }

  public get(): Readonly<ConfigData> {
    return this.config;
  }
}
