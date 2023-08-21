import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsString, IsDefined, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';
import { Assignees } from '../types/assignees';

export class CreateBlogDto {
  @ApiProperty({
    description: 'The name of the blog',
    format: 'string',
    type: String,
  })
  @IsString()
  @IsDefined()
  public name!: string;
  
  @ApiProperty({
    description: 'The description of the blog',
    format: 'string',
    type: String,
  })
  @IsString()
  @IsDefined()
  public description!: string;
  
  @ApiProperty({
    description: 'The url of the image linked to blog',
    format: 'string',
    type: String,
  })
  @IsString()
  @IsOptional()
  public image: string

  @ApiProperty({
    description: 'The name of the blog',
    type: Array<Assignees>,
  })
  @Type(() => Array<Assignees>)
  @IsOptional()
  public assignees!: Array<Assignees>;
}

export class UpdateBlogDto extends PartialType<CreateBlogDto>(CreateBlogDto) {}


