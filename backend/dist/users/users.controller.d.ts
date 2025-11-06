import { UsersService } from './users.service';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
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
