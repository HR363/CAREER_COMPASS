import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
export declare class AuthService {
    private prisma;
    private jwtService;
    constructor(prisma: PrismaService, jwtService: JwtService);
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
    validateUser(email: string, password: string): Promise<{
        name: string;
        email: string;
        role: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    getUserFromToken(token: string): Promise<{
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
    } & {
        name: string;
        email: string;
        password: string;
        role: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
}
