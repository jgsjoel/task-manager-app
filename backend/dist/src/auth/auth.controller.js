var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
import { Controller, Post, Get, Body, HttpCode, Req, Res, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service.js';
import { CsrfService } from '../common/guards/csrf.service.js';
import { RegisterDto } from './dto/register.dto.js';
import { LoginDto } from './dto/login.dto.js';
const REFRESH_COOKIE_OPTIONS = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000,
    path: '/auth',
};
const CSRF_COOKIE_OPTIONS = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000,
    path: '/auth',
};
let AuthController = class AuthController {
    authService;
    csrfService;
    constructor(authService, csrfService) {
        this.authService = authService;
        this.csrfService = csrfService;
    }
    async register(registerDto) {
        return this.authService.register(registerDto);
    }
    getCsrfToken(res) {
        const cookieSecret = this.csrfService.generateCookieSecret();
        res.cookie('csrfSecret', cookieSecret, CSRF_COOKIE_OPTIONS);
        return { csrfToken: this.csrfService.generateToken(cookieSecret) };
    }
    async login(loginDto, res) {
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
    async refresh(req, res) {
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
    logout(res) {
        res.clearCookie('refreshToken', { path: '/auth' });
        res.clearCookie('csrfSecret', { path: '/auth' });
    }
};
__decorate([
    Post('register'),
    HttpCode(201),
    __param(0, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [RegisterDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "register", null);
__decorate([
    Get('csrf-token'),
    HttpCode(200),
    __param(0, Res({ passthrough: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Object)
], AuthController.prototype, "getCsrfToken", null);
__decorate([
    Post('login'),
    HttpCode(200),
    __param(0, Body()),
    __param(1, Res({ passthrough: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [LoginDto, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "login", null);
__decorate([
    Post('refresh'),
    HttpCode(200),
    __param(0, Req()),
    __param(1, Res({ passthrough: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "refresh", null);
__decorate([
    Post('logout'),
    HttpCode(204),
    __param(0, Res({ passthrough: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "logout", null);
AuthController = __decorate([
    Controller('auth'),
    __metadata("design:paramtypes", [AuthService,
        CsrfService])
], AuthController);
export { AuthController };
//# sourceMappingURL=auth.controller.js.map