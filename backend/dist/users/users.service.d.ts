import { PrismaService } from '../prisma/prisma.service';
export declare class UsersService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(role?: string): Promise<{
        profile: {
            education: string;
            skills: string;
            interests: string;
            goals: string;
        };
        name: string;
        email: string;
        role: string;
        id: string;
        createdAt: Date;
    }[]>;
    findOne(id: string): Promise<{
        profile: {
            education: string;
            skills: string;
            interests: string;
            goals: string;
        };
        name: string;
        email: string;
        role: string;
        id: string;
        createdAt: Date;
        resources: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            link: string;
            mentorId: string;
            title: string;
            category: string;
        }[];
    }>;
    getMentors(): Promise<{
        profile: {
            education: string;
            skills: string;
            interests: string;
        };
        name: string;
        email: string;
        id: string;
        resources: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            link: string;
            mentorId: string;
            title: string;
            category: string;
        }[];
    }[]>;
    getStudents(): Promise<{
        profile: {
            education: string;
            skills: string;
            interests: string;
            goals: string;
        };
        name: string;
        email: string;
        id: string;
    }[]>;
}
