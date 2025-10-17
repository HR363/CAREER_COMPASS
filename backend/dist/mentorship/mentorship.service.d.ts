import { PrismaService } from '../prisma/prisma.service';
import { ScheduleSessionDto } from './dto/schedule-session.dto';
export declare class MentorshipService {
    private prisma;
    constructor(prisma: PrismaService);
    scheduleSession(dto: ScheduleSessionDto): Promise<{
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
    }>;
    getSessions(userId: string, userRole: string): Promise<({
        mentor: {
            profile: {
                education: string;
                skills: string;
            };
            name: string;
            email: string;
            id: string;
        };
        student: {
            profile: {
                education: string;
                skills: string;
            };
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
    getSession(sessionId: string, userId: string, userRole: string): Promise<{
        mentor: {
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
            name: string;
            email: string;
            id: string;
        };
        student: {
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
    }>;
    joinSession(sessionId: string, userId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        mentorId: string;
        studentId: string;
        scheduledAt: Date;
        status: string;
        roomId: string;
    }>;
    endSession(sessionId: string, userId: string, userRole: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        mentorId: string;
        studentId: string;
        scheduledAt: Date;
        status: string;
        roomId: string;
    }>;
    cancelSession(sessionId: string, userId: string, userRole: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        mentorId: string;
        studentId: string;
        scheduledAt: Date;
        status: string;
        roomId: string;
    }>;
}
