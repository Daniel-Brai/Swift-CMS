import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  UseGuards,
  UploadedFile,
  UseInterceptors,
  ParseFilePipeBuilder,
  ClassSerializerInterceptor,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiCookieAuth,
  ApiConsumes,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiInternalServerErrorResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnprocessableEntityResponse,
} from '@nestjs/swagger';
import { Logger } from '@pkg/logger';
import { UserRoles } from '../types/role';
import { AccessTokenGuard } from '../../auth/guards/access-token.guard';
import { RoleAllowed } from '../../auth/decorators/roles.decorator';
import { RolesGuard } from '../../auth/guards/role.guard';
import {
  FindUserDto,
  UpdateUserByIdDto,
  UpdateUserPermissionBodyDto,
  UserSignupDto,
  FieldsToUpdateDto,
} from '../dto/user-request.dto';
import { UserSignupResponseDto } from '../dto/user-response.dto';
import { UserService } from '../services/user.service';
import { User } from '../../auth/guards/request-user.guard';
import { UserEntity } from '../entity/user.entity';
import {
  NO_ENTITY_FOUND,
  UNAUTHORIZED_REQUEST,
  BAD_REQUEST,
  INTERNAL_SERVER_ERROR,
} from '../../../app.constants';
import { Reflector } from '@nestjs/core';

@ApiCookieAuth('access_token')
@ApiTags('Users')
@Controller('users')
@UseInterceptors(new ClassSerializerInterceptor(Reflector))
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly logger: Logger,
  ) {}

  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse({
    type: UserSignupResponseDto,
    description: 'User created successfully',
  })
  @ApiOkResponse({ type: UserSignupResponseDto, description: '' })
  @ApiOperation({
    summary: 'Create a user',
    description: 'Post action returns a new user',
  })
  @ApiConsumes('application/json')
  @Post('')
  public async CreateUser(@Body() body: UserSignupDto) {
    this.logger.info(JSON.stringify(body));
    return this.userService.create(body);
  }

  @UseGuards(AccessTokenGuard, RolesGuard)
  @RoleAllowed(UserRoles['super-admin'])
  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse({
    type: UserSignupResponseDto,
    description: 'User updated successfully',
  })
  @ApiOkResponse({ type: UserSignupResponseDto, description: '' })
  @ApiOperation({
    summary: 'Update a user by id',
    description: 'Put action returns the updated user details',
  })
  @ApiConsumes('application/json')
  @UseInterceptors(FileInterceptor('file'))
  @Put('/:id')
  public async UpdateUser(@Body() body: FieldsToUpdateDto) {
    return await this.userService.update(body.email, body);
  }

  @UseGuards(AccessTokenGuard, RolesGuard)
  @RoleAllowed(UserRoles['super-admin'])
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: UserSignupResponseDto, description: '' })
  @ApiOperation({
    summary: 'Find users based on props',
    description: 'Search action returns user(s) based on the properties passed',
  })
  @ApiConsumes('application/json')
  @Get('/search')
  public async findUser(@Param() param: FindUserDto) {
    this.logger.info(JSON.stringify(param));
    return this.userService.findUserByProperty(param);
  }

  @UseGuards(AccessTokenGuard, RolesGuard)
  @RoleAllowed(UserRoles['super-admin'])
  @ApiConsumes('application/json')
  @ApiNotFoundResponse({ description: NO_ENTITY_FOUND })
  @ApiForbiddenResponse({ description: UNAUTHORIZED_REQUEST })
  @ApiUnprocessableEntityResponse({ description: BAD_REQUEST })
  @ApiInternalServerErrorResponse({ description: INTERNAL_SERVER_ERROR })
  @ApiOkResponse({ description: 'Assign permissions to a user' })
  @ApiOperation({
    summary: 'Assign permissions to a user by id',
    description: 'Assign action returns the updated user',
  })
  @ApiConsumes('application/json')
  @Put('/assign-permissions/:id')
  public async assignUserPermissions(
    @Param() param: UpdateUserByIdDto,
    @Body() payload: UpdateUserPermissionBodyDto,
  ) {
    return this.userService.assignUserPermissions(param, payload);
  }

  @UseGuards(AccessTokenGuard, RolesGuard)
  @RoleAllowed(UserRoles['super-admin'])
  @ApiConsumes('application/json')
  @ApiNotFoundResponse({ description: NO_ENTITY_FOUND })
  @ApiForbiddenResponse({ description: UNAUTHORIZED_REQUEST })
  @ApiUnprocessableEntityResponse({ description: BAD_REQUEST })
  @ApiInternalServerErrorResponse({ description: INTERNAL_SERVER_ERROR })
  @ApiOkResponse({ description: 'Users returned successfully' })
  @ApiOperation({
    summary: 'Get all users',
    description: 'Get action returns a paginated view of all users',
  })
  @ApiOkResponse({
    description: 'Returns users details',
  })
  @ApiConsumes('application/json')
  @Get('/')
  public async allUsers() {
    return this.userService.getAllUsers();
  }

  @UseGuards(AccessTokenGuard, RolesGuard)
  @RoleAllowed(UserRoles['super-admin'])
  @ApiConsumes('application/json')
  @ApiNotFoundResponse({ description: NO_ENTITY_FOUND })
  @ApiNoContentResponse({ description: '' })
  @ApiForbiddenResponse({ description: UNAUTHORIZED_REQUEST })
  @ApiUnprocessableEntityResponse({ description: BAD_REQUEST })
  @ApiInternalServerErrorResponse({ description: INTERNAL_SERVER_ERROR })
  @ApiOkResponse({ description: 'User removed successfully' })
  @ApiOperation({
    summary: 'Delete a user by id',
    description: 'Delete action removes user account',
  })
  @ApiOkResponse({
    description: 'Returns no content',
  })
  @Delete('/:id')
  public async deleteUser(@Param('id') id: string) {
    return this.userService.deleteUser(id);
  }

  @UseGuards(AccessTokenGuard)
  @HttpCode(HttpStatus.OK)
  @ApiConsumes('application/json')
  @ApiNotFoundResponse({ description: NO_ENTITY_FOUND })
  @ApiForbiddenResponse({ description: UNAUTHORIZED_REQUEST })
  @ApiUnprocessableEntityResponse({ description: BAD_REQUEST })
  @ApiInternalServerErrorResponse({ description: INTERNAL_SERVER_ERROR })
  @ApiOkResponse({ description: 'User returned successfully' })
  @ApiOperation({
    summary: 'Get current user profile',
    description: 'Get action returns the current session user',
  })
  @ApiOkResponse({
    description: 'Returns Session User details',
  })
  @Get('/profile')
  public async getUserProfile(@User() user: UserEntity) {
    return user;
  }

  @UseGuards(AccessTokenGuard)
  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse({
    type: UserSignupResponseDto,
    description: 'User updated successfully',
  })
  @ApiOkResponse({ type: UserSignupResponseDto, description: '' })
  @ApiOperation({
    summary: 'Update current user profile',
    description: 'Put action returns the updated user details',
  })
  @ApiConsumes('application/json')
  @Put('/profile')
  public async updateUserProfile(
    @User() user: UserEntity,
    @Body() body: FieldsToUpdateDto,
  ) {
    return await this.userService.updateUserProfile(user, body);
  }

  @UseGuards(AccessTokenGuard)
  @HttpCode(HttpStatus.CREATED)
  @ApiConsumes('application/json')
  @ApiNotFoundResponse({ description: NO_ENTITY_FOUND })
  @ApiNoContentResponse({ description: '' })
  @ApiForbiddenResponse({ description: UNAUTHORIZED_REQUEST })
  @ApiUnprocessableEntityResponse({ description: BAD_REQUEST })
  @ApiInternalServerErrorResponse({ description: INTERNAL_SERVER_ERROR })
  @ApiOperation({
    summary: 'Update the current user profile photo',
    description: 'Update Current Session User Profile photo',
  })
  @ApiOkResponse({
    description: 'Return a message',
  })
  @UseInterceptors(FileInterceptor('file'))
  @Post('/profile/upload-photo')
  public async uploadProfilePhoto(
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
    @User() user: UserEntity,
  ) {
    return await this.userService.uploadPhoto(file, user);
  }

  @UseGuards(AccessTokenGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiConsumes('application/json')
  @ApiNotFoundResponse({ description: NO_ENTITY_FOUND })
  @ApiNoContentResponse({ description: '' })
  @ApiForbiddenResponse({ description: UNAUTHORIZED_REQUEST })
  @ApiUnprocessableEntityResponse({ description: BAD_REQUEST })
  @ApiInternalServerErrorResponse({ description: INTERNAL_SERVER_ERROR })
  @ApiOperation({
    summary: 'Delete the current user profile',
    description: 'Delete Current Session User Profile',
  })
  @ApiOkResponse({
    description: 'Returns no content',
  })
  @Delete('/profile')
  public async deleteUserProfile(@User() user: UserEntity) {
    return this.userService.deleteUser(user.id);
  }
}

