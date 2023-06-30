import { NestFactory, Reflector } from '@nestjs/core';
import {
  ValidationPipe,
  Logger,
  ClassSerializerInterceptor,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import { createClient } from 'redis';
import * as createRedisStore from 'connect-redis';
import * as cookieParser from 'cookie-parser';
import * as compression from 'compression';
import * as passport from 'passport';
import * as session from 'express-session';
import helmet from 'helmet';
import * as express from 'express';

const logger: Logger = new Logger();

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const reflector = app.get(Reflector);
  const configService = app.get(ConfigService);

  const PORT: number = +configService.get<number>('PORT') || 3000;
  const RedisStore = createRedisStore(session);

  const redisHost: string = configService.get<string>('REDIS_CLIENT');
  const redisPort: number = +configService.get<number>('REDIS_PORT');
  const redisClient = createClient({
    host: redisHost,
    port: redisPort,
  });

  redisClient.on('error', (e: any) => {
    logger.error(`[Redis]: Redis connection failed: ${e.msg}...`);
  });
  redisClient.on('connect', () => {
    logger.log('[Redis]: Redis connection successful...');
  });

  app.enableCors({});
  app.use(
    session({
      store: new RedisStore({ client: redisClient }),
      secret: `${configService.get<string>('SESSION_SECRET_KEY')}`,
      resave: false,
      saveUninitialized: false,
      cookie: { maxAge: 3600000, httpOnly: true, sameSite: 'strict' },
    }),
  );
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(cookieParser());
  app.use(helmet());
  app.use(compression());
  app.use(express.urlencoded({ extended: true }));

  app.useGlobalInterceptors(new ClassSerializerInterceptor(reflector));
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  await app.listen(PORT);
}

bootstrap()
  .then(() => logger.log(`[Server]: Server initializaton successful...`))
  .catch((e) => {
    logger.error(`[Server]: Server setup failed: ${e.msg}...`);
  });
