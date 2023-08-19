import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CloudinaryModule } from '@pkg/cloudinary';
import { LoggerModule } from '@pkg/logger';
import { PostEntity } from './entity/post.entity';
import { PostService } from './services/post.service';
import { PostController } from './controllers/post.controller';
import { BlogModule } from '../blog/blog.module';
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([PostEntity]),
    CloudinaryModule,
    LoggerModule,
    UserModule,
    BlogModule,
  ],
  controllers: [PostController],
  providers: [PostService],
  exports: [PostService],
})
export class PostModule {}
