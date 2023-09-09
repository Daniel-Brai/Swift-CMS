import {
  Controller,
  UseInterceptors,
  ClassSerializerInterceptor,
  Get,
  Post,
  Body,
  Query,
  Param,
  HttpCode,
  HttpStatus,
  Put,
  UploadedFile,
  ParseFilePipeBuilder,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiCookieAuth,
  ApiConsumes,
  ApiCreatedResponse,
  ApiBadRequestResponse,
  ApiForbiddenResponse,
  ApiInternalServerErrorResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnprocessableEntityResponse,
} from '@nestjs/swagger';
import {
  NO_ENTITY_FOUND,
  UNAUTHORIZED_REQUEST,
  BAD_REQUEST,
  INTERNAL_SERVER_ERROR,
} from '../../../app.constants';
import { Reflector } from '@nestjs/core';
import { BlogService } from '../services/blog.service';
import { CreateBlogDto, UpdateBlogDto } from '../dto/blog-request.dto';
import { User } from '../../auth/guards/request-user.guard';
import { UserEntity } from '../../user/entity/user.entity';
import { AccessTokenGuard } from 'src/domain/auth/guards/access-token.guard';
import { RolesGuard } from '../../auth/guards/role.guard';
import { RoleAllowed } from '../../auth/decorators/roles.decorator';
import { UserRoles } from '../../user/types/role';
import { PageOptionsDto } from '@common/dtos';

@ApiCookieAuth('access_token')
@ApiTags('Blogs')
@Controller('blog')
export class BlogController {
  constructor(private readonly blogService: BlogService) {}

  @UseGuards(AccessTokenGuard, RolesGuard)
  @RoleAllowed(UserRoles['admin'])
  @ApiCreatedResponse({
    description: 'Blog created successfully',
  })
  @ApiOkResponse({ description: 'Blog created successfully' })
  @ApiOperation({
    summary: 'Create a blog',
    description: 'Post action returns a new blog',
  })
  @ApiConsumes('application/json')
  @Post()
  public async CreateBlog(
    @Body() body: CreateBlogDto,
    @User() user: UserEntity,
  ) {
    return await this.blogService.create(body, user);
  }

  @UseGuards(AccessTokenGuard, RolesGuard)
  @RoleAllowed(UserRoles['admin'], UserRoles['editor'])
  @HttpCode(HttpStatus.CREATED)
  @ApiConsumes('application/json')
  @ApiNotFoundResponse({ description: NO_ENTITY_FOUND })
  @ApiNoContentResponse({ description: '' })
  @ApiForbiddenResponse({ description: UNAUTHORIZED_REQUEST })
  @ApiUnprocessableEntityResponse({ description: BAD_REQUEST })
  @ApiInternalServerErrorResponse({ description: INTERNAL_SERVER_ERROR })
  @ApiOperation({
    summary: 'Update blog profile photo by id',
    description: 'Update action returns updated blog profile with photo url',
  })
  @ApiOkResponse({
    description: 'Return a message',
  })
  @UseInterceptors(FileInterceptor('file'))
  @Post('/:id/upload-photo')
  public async UploadProfilePhoto(
    @Param('id') id: string,
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({
          fileType: 'jpeg',
        })
        .addFileTypeValidator({
          fileType: 'jpg',
        })
        .addFileTypeValidator({
          fileType: 'png',
        })
        .addMaxSizeValidator({
          maxSize: 1000,
        })
        .build({
          errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
        }),
    )
    file: Express.Multer.File,
  ) {
    return await this.blogService.uploadPhoto(id, file);
  }

  @UseGuards(AccessTokenGuard, RolesGuard)
  @RoleAllowed(UserRoles['admin'], UserRoles['editor'])
  @ApiOperation({
    summary: 'Get all blog',
    description: 'Get action returns the found blogs in a paginated view',
  })
  @ApiOkResponse({
    description: 'Get action returns the found blogs in a paginated view',
  })
  @ApiInternalServerErrorResponse({
    description: INTERNAL_SERVER_ERROR,
  })
  @ApiBadRequestResponse({ description: BAD_REQUEST })
  @ApiConsumes('application/json')
  @Get('/')
  public async FindAllBlogs(@Query() query: PageOptionsDto) {
    return await this.blogService.find(query);
  }

  @UseGuards(AccessTokenGuard, RolesGuard)
  @RoleAllowed(UserRoles['admin'], UserRoles['editor'])
  @ApiOperation({
    summary: 'Find a blog by id',
    description: 'Get action returns the found blog',
  })
  @ApiOkResponse({
    description: 'Get action returns the found blog',
  })
  @ApiInternalServerErrorResponse({
    description: INTERNAL_SERVER_ERROR,
  })
  @ApiBadRequestResponse({ description: BAD_REQUEST })
  @ApiConsumes('application/json')
  @Get('/:id')
  public async FindBlog(@Param('id') id: string) {
    return await this.blogService.findOne(id);
  }

  @UseGuards(AccessTokenGuard, RolesGuard)
  @RoleAllowed(UserRoles['admin'], UserRoles['editor'])
  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse({
    description: 'Blog updated successfully',
  })
  @ApiOkResponse({ description: 'Blog updated successfully' })
  @ApiOperation({
    summary: 'Update blog by id',
    description: 'Put action returns the updated blog details',
  })
  @ApiConsumes('application/json')
  @Put('/:id')
  public async UpdateBlog(
    @Param('id') id: string,
    @Body() body: UpdateBlogDto,
  ) {
    return await this.blogService.updateOne(id, body);
  }

  @UseGuards(AccessTokenGuard, RolesGuard)
  @RoleAllowed(UserRoles['admin'])
  @ApiConsumes('application/json')
  @ApiNotFoundResponse({ description: NO_ENTITY_FOUND })
  @ApiNoContentResponse({ description: '' })
  @ApiForbiddenResponse({ description: UNAUTHORIZED_REQUEST })
  @ApiUnprocessableEntityResponse({ description: BAD_REQUEST })
  @ApiInternalServerErrorResponse({ description: INTERNAL_SERVER_ERROR })
  @ApiOperation({
    summary: 'Delete a blog by id',
    description: 'Delete action returns a message',
  })
  @ApiOkResponse({
    description: 'Returns a message',
  })
  @Delete('/:id')
  public async DeleteBLog(@Param('id') id: string) {
    return await this.blogService.remove(id);
  }
}
