import { forwardRef, Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ThrottlerModule } from '@nestjs/throttler';
import { LoggerModule } from '@pkg/logger';
import { ConfigModule, ConfigService } from '@pkg/config';
import { UserModule } from '../user/user.module';
import { AuthController } from './controller/auth.controller';
import { AuthService } from './services/auth.service';
import { AccessTokenJwtStrategy } from './strategies/access-jwt.strategy';
import { RefreshTokenJwtStrategy } from './strategies/refresh-jwt.strategy';
import { GoogleOauthStrategy } from './strategies/google-jwt.strategy';
import { GithubOauthStrategy } from './strategies/github-jwt.strategy';

@Module({
  imports: [
    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        ttl: configService.get().services.throttler.ttl,
        limit: configService.get().services.throttler.limit,
      }),
    }),
    LoggerModule,
    ConfigModule,
    PassportModule.register({ defaultStrategy: 'jwt', session: false }),
    JwtModule.register({}),
    forwardRef(() => UserModule),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    RefreshTokenJwtStrategy,
    AccessTokenJwtStrategy,
    GoogleOauthStrategy,
    GithubOauthStrategy,
  ],
  exports: [AuthService],
})
export class AuthModule {}
