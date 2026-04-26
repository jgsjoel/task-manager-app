import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service.js';
import { RegisterDto } from './dto/register.dto.js';
import { LoginDto } from './dto/login.dto.js';
import { AuthResponseDto } from './dto/auth-response.dto.js';
import { UserDto } from './dto/user.dto.js';
export declare class AuthService {
    private prisma;
    private jwtService;
    private readonly logger;
    constructor(prisma: PrismaService, jwtService: JwtService);
    register(registerDto: RegisterDto): Promise<UserDto>;
    login(loginDto: LoginDto): Promise<AuthResponseDto>;
    refresh(refreshToken: string): Promise<{
        accessToken: string;
    }>;
    private generateTokens;
}
