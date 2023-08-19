import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@pkg/config';
import { LoggerModule } from '@pkg/logger';
import { CloudinaryModule } from '@pkg/cloudinary';
import { AuthModule } from '../auth/auth.module';
import { UserEntity } from './entity/user.entity';
import { UserController } from './controller/user.controller';
import { UserService } from './services/user.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity]),
    LoggerModule,
    ConfigModule,
    CloudinaryModule,
    forwardRef(() => AuthModule),
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
