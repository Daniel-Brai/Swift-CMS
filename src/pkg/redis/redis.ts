import { Logger } from '@nestjs/common';
import { ConfigService, ConfigModule } from '@pkg/config';
import { RedisModule } from './redis.module';

export const RedisTransportModule = RedisModule.registerAsync({
  imports: [ConfigModule],
  useFactory: (configService: ConfigService) => {
    const logger = new Logger('RedisTransportModule');

    return {
      connectionOptions: {
        host: `${configService.get().services.redis.host}`,
        port: Number(configService.get().services.redis.port),
      },
      onClientReady: (client) => {
        logger.log('Redis Client initialized...');

        client.on('error', (err) => {
          logger.error(`Redis Client initialization failed: ${err.message}`);
        });

        client.on('connect', () => {
          logger.log(
            `Redis Client initialization successful on ${client.options.host}:${client.options.port}...`,
          );
        });
      },
    };
  },
  inject: [ConfigService],
});
