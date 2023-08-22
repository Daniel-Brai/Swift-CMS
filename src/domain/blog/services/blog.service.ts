import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BlogEntity } from '../entity/blog.entity';
import { CreateBlogDto, UpdateBlogDto } from '../dto/blog-request.dto';
import { UserService } from '../../user/services/user.service';
import { UserEntity } from 'src/domain/user/entity/user.entity';
import { GenericResponse } from '@common/types';

@Injectable()
export class BlogService {
  constructor(
    private readonly userService: UserService,
    @InjectRepository(BlogEntity)
    private readonly blogRepository:  Repository<BlogEntity>,
  ) {}

  public async create(body: CreateBlogDto, user: UserEntity): Promise<BlogEntity> {
    const blog = this.blogRepository.create({
      ...body,
      admin: user,
    });
    try {
      return await this.blogRepository.save(blog); 
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  } 

  public async findOne(id: string): Promise<BlogEntity> {
    try {
      const blog = await this.blogRepository.findOne({
        where: { id: id },
        relations: ['posts'],
      })
      return blog;
    } catch (error) {
      throw new NotFoundException(`No blog with the id ${id} was found: ${error}`);
    }  
  }

  public async updateOne(id: string, body: UpdateBlogDto): Promise<BlogEntity> {
    const foundBlog = await this.findOne(id);
    try {
      const blog = await this.blogRepository.preload({
        id: foundBlog.id,
        ...body,
      });
      return await this.blogRepository.save(blog);
    } catch (error) {
      throw new InternalServerErrorException(error);
    } 
  }
  
  public async remove(id: string): Promise<GenericResponse<BlogEntity>> {
    const foundBlog = await this.findOne(id);

    try {
      await this.blogRepository.delete({ id: foundBlog.id });
      return {
        "message": `Blog with id ${id} was successfully deleted`,
        "data": foundBlog,
      };
    } catch(error) {
      throw new InternalServerErrorException(error); 
    } 
  }
}
