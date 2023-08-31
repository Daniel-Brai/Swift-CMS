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
import { PostService } from '../services/post.service';
import {
  CreatePostDto,
  UpdatePostDto,
  AddPostCommentDto,
} from '../dto/post-request.dto';
import { AccessTokenGuard } from '../../auth/guards/access-token.guard';
import { RolesGuard } from '../../auth/guards/role.guard';
import { RoleAllowed } from '../../auth/decorators/roles.decorator';
import { UserRoles } from '../../user/types/role';
import { Blog } from '../decorators/request-user-blog';
import { PageOptionsDto } from '@common/dtos';

@ApiCookieAuth('access_token')
@ApiTags('Posts')
@Controller('post')
@UseInterceptors(new ClassSerializerInterceptor(Reflector))
export class PostController {
  constructor(private readonly postService: PostService) {}

  @UseGuards(AccessTokenGuard, RolesGuard)
  @RoleAllowed(UserRoles['admin'], UserRoles['editor'])
  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse({
    description: 'Post created successfully',
  })
  @ApiOkResponse({ description: 'Post created successfully' })
  @ApiOperation({
    summary: 'Create a post',
    description: 'Post action returns a new post',
  })
  @ApiConsumes('application/json')
  @Post('/')
  public async CreatePost(@Body() body: CreatePostDto, @Blog() blogId: string) {
    return await this.postService.create(body, blogId);
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
    summary: 'Update post profile photo by id',
    description: 'Update action returns updated post profile with photo url',
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
    return await this.postService.uploadPhoto(id, file);
  }

  @UseGuards(AccessTokenGuard, RolesGuard)
  @RoleAllowed(UserRoles['admin'])
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get all posts',
    description: 'Get action returns the found post in a paginated view',
  })
  @ApiOkResponse({
    description: 'Get action returns the found post in a paginated view',
  })
  @ApiInternalServerErrorResponse({
    description: INTERNAL_SERVER_ERROR,
  })
  @ApiBadRequestResponse({ description: BAD_REQUEST })
  @ApiConsumes('application/json')
  @Get('/')
  public async FindAllPosts(@Query() query: PageOptionsDto) {
    return await this.postService.find(query);
  }

  @UseGuards(AccessTokenGuard, RolesGuard)
  @RoleAllowed(UserRoles['admin'])
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Create a comment',
    description: 'Post action returns the updated comments',
  })
  @ApiOkResponse({
    description: 'Get action returns the updated comments',
  })
  @ApiInternalServerErrorResponse({
    description: INTERNAL_SERVER_ERROR,
  })
  @ApiBadRequestResponse({ description: BAD_REQUEST })
  @ApiConsumes('application/json')
  @Post('/:id/comment')
  public async AddComment(
    @Param('id') id: string,
    @Body() body: AddPostCommentDto,
  ) {
    return await this.postService.addComment(id, body);
  }

  @UseGuards(AccessTokenGuard, RolesGuard)
  @RoleAllowed(UserRoles['admin'], UserRoles['editor'])
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Find a post by id',
    description: 'Get action returns the found post',
  })
  @ApiOkResponse({
    description: 'Get action returns the found post',
  })
  @ApiInternalServerErrorResponse({
    description: INTERNAL_SERVER_ERROR,
  })
  @ApiBadRequestResponse({ description: BAD_REQUEST })
  @ApiConsumes('application/json')
  @Get('/:id')
  public async FindPost(@Param('id') id: string) {
    return await this.postService.findOne(id);
  }

  @UseGuards(AccessTokenGuard, RolesGuard)
  @RoleAllowed(UserRoles['admin'], UserRoles['editor'])
  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse({
    description: 'Post updated successfully',
  })
  @ApiOkResponse({ description: 'Post updated successfully' })
  @ApiOperation({
    summary: 'Update post by id',
    description: 'Put action returns the updated post details',
  })
  @ApiConsumes('application/json')
  @Put('/:id')
  public async UpdatePost(
    @Param('id') id: string,
    @Body() body: UpdatePostDto,
  ) {
    return await this.postService.updateOne(id, body);
  }

  @UseGuards(AccessTokenGuard, RolesGuard)
  @RoleAllowed(UserRoles['admin'])
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiConsumes('application/json')
  @ApiNotFoundResponse({ description: NO_ENTITY_FOUND })
  @ApiNoContentResponse({ description: '' })
  @ApiForbiddenResponse({ description: UNAUTHORIZED_REQUEST })
  @ApiUnprocessableEntityResponse({ description: BAD_REQUEST })
  @ApiInternalServerErrorResponse({ description: INTERNAL_SERVER_ERROR })
  @ApiOperation({
    summary: 'Delete a post by id',
    description: 'Delete action returns a message',
  })
  @ApiOkResponse({
    description: 'Returns a message',
  })
  @Delete('/:id')
  public async DeletePost(@Param('id') id: string) {
    return await this.postService.remove(id);
  }
}
