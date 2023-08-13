import { Module } from '@nestjs/common';
import { DatabaseConfig } from './database.interface';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigModule, ConfigService, DatabaseConfig as DbConfig } from '@pkg/config';

@Module({})
export class DatabaseModule {
  private static getConnectionOptions(
    config: ConfigService,
    dbConfig: DatabaseConfig,
  ): TypeOrmModuleOptions {
    const dbData = config.get().services.database;
    if (!dbData) {
      throw Error('');
    }
    const connectionOptions = this.getConnectionOptionsPostgres(dbData);
    return {
      ...connectionOptions,
      entities: dbConfig.entities,
      synchronize: true,
      logging: dbData.logging,
    };
  }

  private static getConnectionOptionsPostgres(
    dbData: DbConfig,
  ): TypeOrmModuleOptions {
    return {
      type: 'postgres',
      host: dbData.host,
      port: dbData.port,
      username: dbData.username,
      password: dbData.password,
      database: dbData.name,
      // url: dbData.url,
      keepConnectionAlive: true,
      ssl:
        process.env.NODE_ENV !== 'local' && process.env.NODE_ENV !== 'test'
          ? { rejectUnauthorized: false }
          : false,
    };
  }

  public static forRoot(dbConfig: DatabaseConfig) {
    return {
      module: DatabaseModule,
      imports: [
        TypeOrmModule.forRootAsync({
          imports: [ConfigModule],
          useFactory: (configService: ConfigService) => {
            return DatabaseModule.getConnectionOptions(configService, dbConfig);
          },
          inject: [ConfigService],
        }),
      ],
      controllers: [],
      providers: [],
      exports: [],
    };
  }
}
