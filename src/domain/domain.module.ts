import { Module } from '@nestjs/common';
import { DatabaseModule } from '@pkg/database';
import { ConfigModule } from '@pkg/config';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { UserEntity } from './user/entity/user.entity';
import { BlogModule } from './blog/blog.module';
import { BlogEntity } from './blog/entity/blog.entity';

@Module({
  imports: [
    ConfigModule,
    DatabaseModule.forRoot({
      entities: [UserEntity, BlogEntity],
    }),
    UserModule,
    AuthModule,
    BlogModule,
  ],
  controllers: [],
  providers: [],
})
export class DomainModule {}
