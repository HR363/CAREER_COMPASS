"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MentorshipService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const uuid_1 = require("uuid");
let MentorshipService = class MentorshipService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async scheduleSession(dto) {
        const mentor = await this.prisma.user.findUnique({
            where: { id: dto.mentorId, role: 'MENTOR' },
        });
        if (!mentor) {
            throw new common_1.NotFoundException('Mentor not found');
        }
        const student = await this.prisma.user.findUnique({
            where: { id: dto.studentId, role: 'STUDENT' },
        });
        if (!student) {
            throw new common_1.NotFoundException('Student not found');
        }
        const roomId = `room_${(0, uuid_1.v4)()}`;
        return this.prisma.session.create({
            data: {
                mentorId: dto.mentorId,
                studentId: dto.studentId,
                scheduledAt: new Date(dto.scheduledAt),
                status: 'SCHEDULED',
                roomId,
            },
            include: {
                mentor: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
                student: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
            },
        });
    }
    async getSessions(userId, userRole) {
        const where = userRole === 'MENTOR'
            ? { mentorId: userId }
            : userRole === 'STUDENT'
                ? { studentId: userId }
                : {};
        return this.prisma.session.findMany({
            where,
            include: {
                mentor: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        profile: {
                            select: {
                                education: true,
                                skills: true,
                            },
                        },
                    },
                },
                student: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        profile: {
                            select: {
                                education: true,
                                skills: true,
                            },
                        },
                    },
                },
            },
            orderBy: {
                scheduledAt: 'desc',
            },
        });
    }
    async getSession(sessionId, userId, userRole) {
        const session = await this.prisma.session.findUnique({
            where: { id: sessionId },
            include: {
                mentor: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        profile: true,
                    },
                },
                student: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        profile: true,
                    },
                },
            },
        });
        if (!session) {
            throw new common_1.NotFoundException('Session not found');
        }
        if (userRole !== 'ADMIN' && session.mentorId !== userId && session.studentId !== userId) {
            throw new common_1.ForbiddenException('Access denied to this session');
        }
        return session;
    }
    async joinSession(sessionId, userId) {
        const session = await this.getSession(sessionId, userId, 'ADMIN');
        return this.prisma.session.update({
            where: { id: sessionId },
            data: {
                status: 'IN_PROGRESS',
            },
        });
    }
    async endSession(sessionId, userId, userRole) {
        const session = await this.getSession(sessionId, userId, userRole);
        return this.prisma.session.update({
            where: { id: sessionId },
            data: {
                status: 'COMPLETED',
            },
        });
    }
    async cancelSession(sessionId, userId, userRole) {
        const session = await this.getSession(sessionId, userId, userRole);
        return this.prisma.session.update({
            where: { id: sessionId },
            data: {
                status: 'CANCELLED',
            },
        });
    }
};
exports.MentorshipService = MentorshipService;
exports.MentorshipService = MentorshipService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], MentorshipService);
//# sourceMappingURL=mentorship.service.js.map