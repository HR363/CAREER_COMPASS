import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

  async getDashboardStats() {
    const [
      totalUsers,
      totalMentors,
      totalStudents,
      totalSessions,
      activeSessions,
      completedSessions,
      totalRecommendations,
    ] = await Promise.all([
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

  async updateUserRole(userId: string, role: string) {
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

  async deleteUser(userId: string) {
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
}
