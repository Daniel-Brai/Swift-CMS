import { Module } from '@nestjs/common';
// import { TerminusModule } from '@nestjs/terminus';
// import { DatabaseModule } from '@modules/database';
// import { ConfigModule } from '@modules/config';
// import { LoggerModule } from '@modules/logger';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { UserEntity } from './user/entity/user.entity';

@Module({
  imports: [
    // DatabaseModule.forRoot({
    //   entities: [UserEntity, PollEntity],
    // }),
    UserModule,
    AuthModule,
  ],
  controllers: [],
  providers: [],
})
export class DomainModule {}
