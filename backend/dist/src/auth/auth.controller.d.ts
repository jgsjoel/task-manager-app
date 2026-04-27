import type { Request, Response } from 'express';
import { AuthService } from './auth.service.js';
import { CsrfService } from '../common/guards/csrf.service.js';
import { RegisterDto } from './dto/register.dto.js';
import { LoginDto } from './dto/login.dto.js';
import { AuthResponseDto } from './dto/auth-response.dto.js';
import { UserDto } from './dto/user.dto.js';
export declare class AuthController {
    private readonly authService;
    private readonly csrfService;
    constructor(authService: AuthService, csrfService: CsrfService);
    register(registerDto: RegisterDto): Promise<UserDto>;
    getCsrfToken(res: Response): {
        csrfToken: string;
    };
    login(loginDto: LoginDto, res: Response): Promise<AuthResponseDto>;
    refresh(req: Request, res: Response): Promise<{
        accessToken: string;
        csrfToken: string;
    }>;
    logout(res: Response): void;
}
