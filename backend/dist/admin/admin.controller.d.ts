import { AdminService } from './admin.service';
export declare class AdminController {
    private readonly adminService;
    constructor(adminService: AdminService);
    getDashboardStats(): Promise<{
        users: {
            total: number;
            mentors: number;
            students: number;
        };
        sessions: {
            total: number;
            active: number;
            completed: number;
        };
        recommendations: {
            total: number;
        };
    }>;
    getAllUsers(): Promise<{
        profile: {
            education: string;
            skills: string;
            interests: string;
        };
        name: string;
        email: string;
        role: string;
        id: string;
        createdAt: Date;
        _count: {
            mentorSessions: number;
            studentSessions: number;
        };
    }[]>;
    getAllSessions(): Promise<({
        mentor: {
            name: string;
            email: string;
            id: string;
        };
        student: {
            name: string;
            email: string;
            id: string;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        mentorId: string;
        studentId: string;
        scheduledAt: Date;
        status: string;
        roomId: string;
    })[]>;
    getAllRecommendations(): Promise<({
        user: {
            name: string;
            email: string;
            id: string;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        suggestedCareers: string | null;
        learningPath: string | null;
    })[]>;
    updateUserRole(userId: string, body: {
        role: string;
    }): Promise<{
        name: string;
        email: string;
        role: string;
        id: string;
    }>;
    deleteUser(userId: string): Promise<{
        name: string;
        email: string;
        password: string;
        role: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    getResourceStats(): Promise<(import(".prisma/client").Prisma.PickEnumerable<import(".prisma/client").Prisma.ResourceGroupByOutputType, "category"[]> & {
        _count: {
            category: number;
        };
    })[]>;
}
