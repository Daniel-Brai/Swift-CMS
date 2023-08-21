import { ApiResponseProperty } from '@nestjs/swagger';
import { PostCategory } from '../types/post-category';
import { PostComment } from '../types/post-comment';
import { PostImage } from '../types/post-image';

export class CreatePostResponseDto {
  @ApiResponseProperty({
    example: 'Why Gen-Z wants to feel special?',
    format: 'string',
    type: String,
  })
  public title: string;

  @ApiResponseProperty({
    example: 'The Gazatte',
    format: 'string',
    type: String,
  })
  public blog: string;

  @ApiResponseProperty({
    example: '[]',
    type: Array<PostCategory>,
  })
  public category: Array<PostCategory>;

  @ApiResponseProperty({
    example: '[]',
    type: Array<PostComment>,
  })
  public comment: Array<PostComment>;

  @ApiResponseProperty({
    example: '[]',
    type: Array<PostImage>,
  })
  public images: Array<PostImage>;
}
