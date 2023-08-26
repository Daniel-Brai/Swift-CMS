import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Req,
  Res,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiConsumes,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { AuthService } from '../services/auth.service';
import { UserSignInDto } from '../dto/auth-request.dto';
import { UserSignInResponseDto } from '../dto/auth-response.dto';
import { RefreshTokenGuard } from '../guards/refresh-token.guard';
import { AccessTokenGuard } from '../guards/access-token.guard';
import { GoogleOauthGuard } from '../guards/google-auth.guard';
import { GithubOauthGuard } from '../guards/github-auth.guard';
import { Response } from 'express';
import {
  NO_ENTITY_FOUND,
  UNAUTHORIZED_REQUEST,
  BAD_REQUEST,
  INTERNAL_SERVER_ERROR,
} from '../../../app.constants';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Login user by email and password',
    description: 'Login action returns user data, access and refresh token',
  })
  @ApiOkResponse({
    description: 'User login successful',
    type: UserSignInResponseDto,
  })
  @ApiInternalServerErrorResponse({
    description: INTERNAL_SERVER_ERROR,
  })
  @ApiBadRequestResponse({ description: BAD_REQUEST })
  @ApiConsumes('application/json')
  @Post('/login')
  public async CreateUser(
    @Body() body: UserSignInDto,
    @Req() _req: any,
    @Res() res: Response,
  ) {
    const response = await this.authService.validateUserByPassword(body);
    res.cookie('access_token', response.access_token, {
      httpOnly: true,
      sameSite: 'lax',
    });
    res.cookie('refresh_token', response.refresh_token, {
      httpOnly: true,
      sameSite: 'lax',
    });
    return res.send(response);
  }

  @UseGuards(AccessTokenGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    description: 'Logout user',
    summary: 'Logout action removes access and refresh token',
  })
  @ApiConsumes('application/json')
  @Get('/logout')
  public async logout(@Req() _req: any, @Res() res: Response) {
    res.cookie('access_token', '', {
      httpOnly: true,
      sameSite: 'lax',
    });
    res.cookie('refresh_token', '', {
      httpOnly: true,
      sameSite: 'lax',
    });
    return res.send();
  }

  @UseGuards(RefreshTokenGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    description: 'Refresh user authentication token',
    summary: 'Refresh action return new refresh token',
  })
  @ApiConsumes('application/json')
  @Post('/refresh')
  public async refreshToken(@Req() req: any) {
    const user = req.user;
    return await this.authService.refreshToken(user);
  }

  @UseGuards(GoogleOauthGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    description: 'Login user using google',
    summary: 'Login action returns google oauth content screen ',
  })
  @Get('social/google/login')
  public async googleAuth(@Req() _req: any) {}

  @UseGuards(GoogleOauthGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    description: 'Redirect callback for google auth',
    summary:
      'Callback action returns user data, access and refresh token and redirectes to the root url ',
  })
  @Get('social/google/callback')
  public async googleAuthRedirect(@Req() req: any, @Res() res: Response) {
    const response = await this.authService.createSocialAuthToken(req.user);
    res.cookie('access_token', response.access_token, {
      httpOnly: true,
      sameSite: 'lax',
    });
    res.cookie('refresh_token', response.refresh_token, {
      httpOnly: true,
      sameSite: 'lax',
    });
    return res.redirect('/');
  }

  @UseGuards(GithubOauthGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    description: 'Login user using google',
    summary: 'Login action returns google oauth content screen ',
  })
  @Get('social/github/login')
  public async githubAuth(@Req() _req: any) {}

  @UseGuards(GithubOauthGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    description: 'Redirect callback for github auth',
    summary:
      'Callback action returns user data, access and refresh token and redirectes to the root url ',
  })
  @Get('social/github/callback')
  public async githubAuthRedirect(@Req() req: any, @Res() res: Response) {
    const response = await this.authService.createSocialAuthToken(req.user);
    res.cookie('access_token', response.access_token, {
      httpOnly: true,
      sameSite: 'lax',
    });
    res.cookie('refresh_token', response.refresh_token, {
      httpOnly: true,
      sameSite: 'lax',
    });
    return res.redirect(`/`);
  }
}
