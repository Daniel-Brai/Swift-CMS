import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CloudinaryModule } from '@pkg/cloudinary';
import { LoggerModule } from '@pkg/logger';
import { BlogEntity } from './entity/blog.entity';
import { BlogService } from './services/blog.service';
import { BlogController } from './controllers/blog.controller';
import { UserModule } from '../user/user.module';
import { PostModule } from '../post/post.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([BlogEntity]),
    LoggerModule,
    UserModule,
    PostModule,
    CloudinaryModule,
  ],
  controllers: [BlogController],
  providers: [BlogService],
  exports: [BlogService],
})
export class BlogModule {}
