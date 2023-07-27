import { NestFactory, Reflector } from '@nestjs/core';
import {
  ValidationPipe,
  Logger,
  ClassSerializerInterceptor,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import { join } from 'path';
import * as cookieParser from 'cookie-parser';
import * as compression from 'compression';
import * as passport from 'passport';
import * as express from 'express';
import helmet from 'helmet';

const logger: Logger = new Logger();

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const reflector = app.get(Reflector);
  const configService = app.get(ConfigService);

  app.use(cookieParser());
  app.use(helmet());
  app.use(compression());
  app.use(express.urlencoded({ extended: true }));

  app.setViewEngine('hbs');
  app.useStaticAssets(join(__dirname, '../client/www/root'));
  app.setBaseViewsDir(join(__dirname, '../client/views'));

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
