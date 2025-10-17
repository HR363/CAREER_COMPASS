import { MentorshipService } from './mentorship.service';
import { ScheduleSessionDto } from './dto/schedule-session.dto';
export declare class MentorshipController {
    private readonly mentorshipService;
    constructor(mentorshipService: MentorshipService);
    scheduleSession(scheduleSessionDto: ScheduleSessionDto, user: any): Promise<{
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
    getSessions(user: any): Promise<({
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
    getSession(sessionId: string, user: any): Promise<{
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
    joinSession(sessionId: string, user: any): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        mentorId: string;
        studentId: string;
        scheduledAt: Date;
        status: string;
        roomId: string;
    }>;
    endSession(sessionId: string, user: any): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        mentorId: string;
        studentId: string;
        scheduledAt: Date;
        status: string;
        roomId: string;
    }>;
    cancelSession(sessionId: string, user: any): Promise<{
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
