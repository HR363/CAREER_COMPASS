import { ProfilesService } from './profiles.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
export declare class ProfilesController {
    private readonly profilesService;
    constructor(profilesService: ProfilesService);
    getProfile(user: any): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        education: string | null;
        skills: string | null;
        interests: string | null;
        goals: string | null;
    }>;
    updateProfile(user: any, updateProfileDto: UpdateProfileDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        education: string | null;
        skills: string | null;
        interests: string | null;
        goals: string | null;
    }>;
    getUserProfile(user: any, userId: string): Promise<{
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
