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
import { AuthService } from '../services/auth.service';
import { UserSignInDto } from '../dto/auth-request.dto';
import { UserSignInResponseDto } from '../dto/auth-response.dto';
import { RefreshTokenGuard } from '../guards/refresh-token.guard';
import { AccessTokenGuard } from '../guards/access-token.guard';
import { GoogleOauthGuard } from '../guards/google-auth.guard';
import { GithubOauthGuard } from '../guards/github-auth.guard';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
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
  @Post('/refresh')
  public async refreshToken(@Req() req: any) {
    const user = req.user;
    return await this.authService.refreshToken(user);
  }

  @UseGuards(GoogleOauthGuard)
  @HttpCode(HttpStatus.OK)
  @Get('social/google/login')
  public async googleAuth(@Req() _req: any) {}

  @UseGuards(GoogleOauthGuard)
  @HttpCode(HttpStatus.OK)
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
  @Get('social/github/login')
  public async githubAuth(@Req() _req: any) {}

  @UseGuards(GithubOauthGuard)
  @HttpCode(HttpStatus.OK)
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
