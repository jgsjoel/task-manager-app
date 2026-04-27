var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var AuthService_1;
import { Injectable, BadRequestException, UnauthorizedException, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service.js';
import * as bcrypt from 'bcrypt';
let AuthService = AuthService_1 = class AuthService {
    prisma;
    jwtService;
    logger = new Logger(AuthService_1.name);
    constructor(prisma, jwtService) {
        this.prisma = prisma;
        this.jwtService = jwtService;
    }
    async register(registerDto) {
        try {
            const { email, password, name } = registerDto;
            const existingUser = await this.prisma.user.findUnique({
                where: { email },
            });
            if (existingUser) {
                throw new BadRequestException('Email already registered');
            }
            const hashedPassword = await bcrypt.hash(password, 10);
            const user = await this.prisma.user.create({
                data: {
                    email,
                    password: hashedPassword,
                    name,
                },
            });
            this.logger.log(`User registered successfully: ${user.email}`);
            return {
                id: user.id,
                email: user.email,
                name: user.name,
            };
        }
        catch (error) {
            this.logger.error(`Registration error: ${error.message}`);
            if (error instanceof BadRequestException) {
                throw error;
            }
            throw new BadRequestException('Registration failed');
        }
    }
    async login(loginDto) {
        try {
            const { email, password } = loginDto;
            const user = await this.prisma.user.findUnique({
                where: { email },
            });
            if (!user) {
                throw new UnauthorizedException('Invalid email or password');
            }
            const isPasswordValid = await bcrypt.compare(password, user.password);
            if (!isPasswordValid) {
                throw new UnauthorizedException('Invalid email or password');
            }
            this.logger.log(`User logged in successfully: ${user.email}`);
            const tokens = this.generateTokens(user.id, user.email);
            return {
                accessToken: tokens.accessToken,
                refreshToken: tokens.refreshToken,
                user: {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                },
            };
        }
        catch (error) {
            this.logger.error(`Login error: ${error.message}`);
            if (error instanceof UnauthorizedException) {
                throw error;
            }
            throw new UnauthorizedException('Login failed');
        }
    }
    async refresh(refreshToken) {
        try {
            const decoded = this.jwtService.verify(refreshToken, {
                secret: process.env.JWT_REFRESH_SECRET || 'refresh-secret-key',
            });
            const tokens = this.generateTokens(decoded.sub, decoded.email);
            this.logger.log(`Token refreshed for user: ${decoded.email}`);
            return tokens;
        }
        catch (error) {
            this.logger.error(`Token refresh error: ${error.message}`);
            throw new UnauthorizedException('Invalid or expired refresh token');
        }
    }
    generateTokens(userId, email) {
        const accessToken = this.jwtService.sign({ sub: userId, email }, { expiresIn: '15m' });
        const refreshToken = this.jwtService.sign({ sub: userId, email }, {
            secret: process.env.JWT_REFRESH_SECRET || 'refresh-secret-key',
            expiresIn: '7d',
        });
        return { accessToken, refreshToken };
    }
};
AuthService = AuthService_1 = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [PrismaService,
        JwtService])
], AuthService);
export { AuthService };
//# sourceMappingURL=auth.service.js.map