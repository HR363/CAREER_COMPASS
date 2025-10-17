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
exports.AdminService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let AdminService = class AdminService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getDashboardStats() {
        const [totalUsers, totalMentors, totalStudents, totalSessions, activeSessions, completedSessions, totalRecommendations,] = await Promise.all([
            this.prisma.user.count(),
            this.prisma.user.count({ where: { role: 'MENTOR' } }),
            this.prisma.user.count({ where: { role: 'STUDENT' } }),
            this.prisma.session.count(),
            this.prisma.session.count({ where: { status: 'IN_PROGRESS' } }),
            this.prisma.session.count({ where: { status: 'COMPLETED' } }),
            this.prisma.recommendation.count(),
        ]);
        return {
            users: {
                total: totalUsers,
                mentors: totalMentors,
                students: totalStudents,
            },
            sessions: {
                total: totalSessions,
                active: activeSessions,
                completed: completedSessions,
            },
            recommendations: {
                total: totalRecommendations,
            },
        };
    }
    async getAllUsers() {
        return this.prisma.user.findMany({
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                createdAt: true,
                profile: {
                    select: {
                        education: true,
                        skills: true,
                        interests: true,
                    },
                },
                _count: {
                    select: {
                        mentorSessions: true,
                        studentSessions: true,
                    },
                },
            },
            orderBy: {
                createdAt: 'desc',
            },
        });
    }
    async getAllSessions() {
        return this.prisma.session.findMany({
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
            orderBy: {
                scheduledAt: 'desc',
            },
        });
    }
    async getAllRecommendations() {
        return this.prisma.recommendation.findMany({
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
            },
            orderBy: {
                createdAt: 'desc',
            },
        });
    }
    async updateUserRole(userId, role) {
        return this.prisma.user.update({
            where: { id: userId },
            data: { role },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
            },
        });
    }
    async deleteUser(userId) {
        return this.prisma.user.delete({
            where: { id: userId },
        });
    }
    async getResourceStats() {
        return this.prisma.resource.groupBy({
            by: ['category'],
            _count: {
                category: true,
            },
        });
    }
};
exports.AdminService = AdminService;
exports.AdminService = AdminService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AdminService);
//# sourceMappingURL=admin.service.js.map