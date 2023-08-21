import { ApiResponseProperty } from '@nestjs/swagger';
import { Assignees } from '../types/assignees';

export class CreateBlogResponseDto {
  @ApiResponseProperty({
    example: 'The Gazette',
    format: 'string',
    type: String,
  })
  public name: string;

  @ApiResponseProperty({
    example: 'John Doe',
    format: 'string',
    type: String,
  })
  public admin: string;

  @ApiResponseProperty({
    example: 'An insight into technology',
    format: 'string',
    type: String,
  })
  public description: string;

  @ApiResponseProperty({
    example: 'https://cdn.website.com/gazatte-5679699.jpg',
    format: 'string',
    type: String,
  })
  public image: string;

  @ApiResponseProperty({
    example: '[]',
    type: Array<Assignees>,
  })
  public assignees: Array<Assignees>;
}
