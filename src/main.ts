import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@pkg/config';
import { Logger } from '@pkg/logger';
import { HttpExceptionFilter } from '@common/http';
import { AppModule } from './app.module';
import * as express from 'express';
import * as compression from 'compression';
import * as cookieParser from 'cookie-parser';
import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const configService = app.get(ConfigService);
  const logger = app.get(Logger);

  const PORT = configService.get().environment.port;
  const GLOBAL_ROUTE_PREFIX = 'api/v1';

  app.enableCors({
    origin: [`http://localhost:${PORT}`, `http://127.0.0.1:${PORT}`],
  });

  app.setGlobalPrefix(GLOBAL_ROUTE_PREFIX);
  app.useGlobalFilters(new HttpExceptionFilter());
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

  app.use(compression());
  app.use(cookieParser());
  app.use(express.urlencoded({ extended: true }));
  app.use(
    helmet.contentSecurityPolicy({
      useDefaults: true,
      directives: {
        'img-src': ["'self'", 'https: data:'],
      },
    }),
  );
  app.use((req: express.Request, _: any, next: express.NextFunction) => {
    logger.info(
      `[Server]: The url invoked is: '${req.originalUrl}' from ip address: ${req.ip}`,
    );
    next();
  });

  await app.listen(PORT, () => {
    logger.log(`[Server]: Server is up and running at port ${PORT}...`);
  });
}

bootstrap();
