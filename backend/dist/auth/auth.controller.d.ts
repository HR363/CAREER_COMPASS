import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    register(registerDto: RegisterDto): Promise<{
        user: {
            name: string;
            email: string;
            role: string;
            id: string;
            createdAt: Date;
        };
        token: string;
    }>;
    login(loginDto: LoginDto): Promise<{
        user: {
            id: string;
            email: string;
            name: string;
            role: string;
            profile: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                userId: string;
                education: string | null;
                skills: string | null;
                interests: string | null;
                goals: string | null;
            };
        };
        token: string;
    }>;
    getProfile(req: any): Promise<any>;
}
