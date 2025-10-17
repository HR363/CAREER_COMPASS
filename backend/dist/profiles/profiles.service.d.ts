import { PrismaService } from '../prisma/prisma.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
export declare class ProfilesService {
    private prisma;
    constructor(prisma: PrismaService);
    getProfile(userId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        education: string | null;
        skills: string | null;
        interests: string | null;
        goals: string | null;
    }>;
    updateProfile(userId: string, updateProfileDto: UpdateProfileDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        education: string | null;
        skills: string | null;
        interests: string | null;
        goals: string | null;
    }>;
    getUserProfile(userId: string): Promise<{
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
