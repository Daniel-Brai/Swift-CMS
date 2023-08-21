import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsDefined, IsString, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';
import { PostCategory } from '../types/post-category';
import { PostComment } from '../types/post-comment';
import { PostImage } from '../types/post-image';

export class CreatePostDto {
  @ApiProperty({
    description: 'The title of the article',
    type: String,
    required: true,
  })
  @IsString()
  @IsDefined()
  public title: string;

  @ApiProperty({
    description: 'The content of the article',
    type: String,
    required: true,
  })
  @IsString()
  @IsDefined()
  public content: string;

  @ApiProperty({
    description: 'The category or tag of the article',
    type: Array<PostCategory>,
    required: false,
  })
  @Type(() => Array<PostCategory>)
  @IsOptional()
  public category?: Array<PostCategory>;
  
  @ApiProperty({
    description: 'The image used in the article',
    type: Array<PostImage>,
    required: false,
  })
  @Type(() => Array<PostImage>)
  @IsOptional()
  public images?: Array<PostImage>;
}

export class UpdataPostDto extends PartialType<CreatePostDto>(CreatePostDto) {}

export class AddPostCommentDto {
  @ApiProperty({
    description: 'The comment added by the visitor to the blog',
    type: Array<PostComment>,
    required: true,
  })
  @Type(() => Array<PostComment>)
  @IsDefined()
  public comments: Array<PostComment>;
}
