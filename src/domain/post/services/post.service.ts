import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PostEntity } from '../entity/post.entity';
import {
  AddPostCommentDto,
  CreatePostDto,
  UpdatePostDto,
} from '../dto/post-request.dto';
import { BlogService } from '../../blog/services/blog.service';
import { BlogEntity } from '../../blog/entity/blog.entity';
import { GenericResponse } from '@common/types';
import { CloudinaryService } from '@pkg/cloudinary';
import { PageOptionsDto, PageDto, PageMetaDto } from '@common/dtos';
import { PostComment } from '../types/post-comment';

@Injectable()
export class PostService {
  constructor(
    private readonly blogService: BlogService,
    private readonly cloudinaryService: CloudinaryService,
    @InjectRepository(PostEntity)
    private readonly postRepository: Repository<PostEntity>,
  ) {}

  public async create(
    body: CreatePostDto,
    blogId: string,
  ): Promise<PostEntity> {
    const foundBlog = await this.blogService.findOne(blogId);
    const createdPost = this.postRepository.create({
      ...body,
      blog: foundBlog,
    });
    try {
      return await this.postRepository.save(createdPost);
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  public async find(body: PageOptionsDto): Promise<PageDto<PostEntity>> {
    const qb = this.postRepository.createQueryBuilder('posts');

    try {
      qb.orderBy('posts.created_at', body.order)
        .skip(body.skip)
        .take(body.take);
      const postCount = await qb.getCount();
      const { entities } = await qb.getRawAndEntities();
      const pageMetaData = new PageMetaDto({
        pageOptionsDto: body,
        itemCount: postCount,
      });
      return new PageDto(entities, pageMetaData);
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  public async findOne(id: string): Promise<PostEntity> {
    try {
      const post = await this.postRepository.findOne({
        where: { id: id },
        relations: ['blog'],
      });
      return post;
    } catch (error) {
      throw new NotFoundException(
        `No post with the id ${id} was found: ${error}`,
      );
    }
  }

  public async updateOne(id: string, body: UpdatePostDto): Promise<PostEntity> {
    const foundPost = await this.findOne(id);
    try {
      const post = await this.postRepository.preload({
        id: foundPost.id,
        ...body,
      });
      return await this.postRepository.save(post);
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  public async addComment(
    id: string,
    body: AddPostCommentDto,
  ): Promise<Array<PostComment>> {
    const foundPost = await this.findOne(id);

    try {
      let { username, comment } = body;
      if (username === null) {
        username = `Anonymous${Math.round(Date.now()).toString(36)}`;
      }
      const newComment: Array<PostComment> = [
        {
          username: username,
          comment: comment,
        },
      ];
      const updatedPost = await this.postRepository.preload({
        id: foundPost.id,
        comments: [...newComment, ...foundPost.comments],
        ...foundPost,
      });
      const { comments } = await this.postRepository.save(updatedPost);
      return comments;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  public async uploadPhoto(
    id: string,
    file: Express.Multer.File,
  ): Promise<GenericResponse> {
    const foundPost = await this.findOne(id);
    try {
      const { secure_url } = await this.cloudinaryService.uploadFile(file);
      const newImages = [
        {
          url: secure_url,
          tag: file.originalname,
        },
      ];
      const updatedPost = await this.postRepository.preload({
        id: foundPost.id,
        images: [...foundPost.images, ...newImages],
        ...foundPost,
      });
      await this.postRepository.save(updatedPost);
      return {
        message: 'Profile photo updated successfully',
      };
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  public async remove(id: string): Promise<GenericResponse> {
    const foundPost = await this.findOne(id);

    try {
      await this.postRepository.delete({ id: foundPost.id });
      return {
        message: `Post with id ${id} was successfully deleted`,
      };
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
}
