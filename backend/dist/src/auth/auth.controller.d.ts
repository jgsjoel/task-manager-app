import { AuthService } from './auth.service.js';
import { RegisterDto } from './dto/register.dto.js';
import { LoginDto } from './dto/login.dto.js';
import { AuthResponseDto } from './dto/auth-response.dto.js';
import { UserDto } from './dto/user.dto.js';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    register(registerDto: RegisterDto): Promise<UserDto>;
    login(loginDto: LoginDto): Promise<AuthResponseDto>;
    refresh(body: {
        refreshToken?: string;
    }): Promise<{
        accessToken: string;
    }>;
}
