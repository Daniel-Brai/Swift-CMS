import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { JwtModule } from '@nestjs/jwt';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@pkg/config';
import { DomainModule } from './domain/domain.module';

@Module({
  imports: [ConfigModule, JwtModule, DomainModule, TerminusModule, HttpModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
