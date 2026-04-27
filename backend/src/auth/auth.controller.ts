import { Controller, Post, Get, Body, HttpCode, Req, Res, UnauthorizedException } from '@nestjs/common';
import type { Request, Response } from 'express';
import { AuthService } from './auth.service.js';
import { CsrfService } from '../common/guards/csrf.service.js';
import { RegisterDto } from './dto/register.dto.js';
import { LoginDto } from './dto/login.dto.js';
import { AuthResponseDto } from './dto/auth-response.dto.js';
import { UserDto } from './dto/user.dto.js';

const REFRESH_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict' as const,
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  path: '/auth',
};

const CSRF_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict' as const,
  maxAge: 7 * 24 * 60 * 60 * 1000, // match refresh token lifetime
  path: '/auth',
};

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly csrfService: CsrfService,
  ) {}

  @Post('register')
  @HttpCode(201)
  async register(@Body() registerDto: RegisterDto): Promise<UserDto> {
    return this.authService.register(registerDto);
  }

  /**
   * Called on page load. Sets a new csrfSecret HttpOnly cookie and returns
   * the signed token in the body for the client to store in memory.
   * Client then calls POST /auth/refresh with this token to restore session.
   */
  @Get('csrf-token')
  @HttpCode(200)
  getCsrfToken(@Res({ passthrough: true }) res: Response): { csrfToken: string } {
    const cookieSecret = this.csrfService.generateCookieSecret();
    res.cookie('csrfSecret', cookieSecret, CSRF_COOKIE_OPTIONS);
    return { csrfToken: this.csrfService.generateToken(cookieSecret) };
  }

  @Post('login')
  @HttpCode(200)
  async login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<AuthResponseDto> {
    const authResponse = await this.authService.login(loginDto);

    res.cookie('refreshToken', authResponse.refreshToken, REFRESH_COOKIE_OPTIONS);

    const cookieSecret = this.csrfService.generateCookieSecret();
    res.cookie('csrfSecret', cookieSecret, CSRF_COOKIE_OPTIONS);

    return {
      accessToken: authResponse.accessToken,
      csrfToken: this.csrfService.generateToken(cookieSecret),
      user: authResponse.user,
    };
  }

  @Post('refresh')
  @HttpCode(200)
  async refresh(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ): Promise<{ accessToken: string; csrfToken: string }> {
    const refreshToken = req.cookies?.refreshToken;
    if (!refreshToken) {
      throw new UnauthorizedException('No refresh token provided');
    }

    const tokens = await this.authService.refresh(refreshToken);

    res.cookie('refreshToken', tokens.refreshToken, REFRESH_COOKIE_OPTIONS);

    const cookieSecret = this.csrfService.generateCookieSecret();
    res.cookie('csrfSecret', cookieSecret, CSRF_COOKIE_OPTIONS);

    return {
      accessToken: tokens.accessToken,
      csrfToken: this.csrfService.generateToken(cookieSecret),
    };
  }

  @Post('logout')
  @HttpCode(204)
  logout(@Res({ passthrough: true }) res: Response): void {
    res.clearCookie('refreshToken', { path: '/auth' });
    res.clearCookie('csrfSecret', { path: '/auth' });
  }
}
