import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findAll(role?: string) {
    const where = role ? { role } : {};
    
    return this.prisma.user.findMany({
      where,
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
            goals: true,
          },
        },
      },
    });
  }

  async findOne(id: string) {
    return this.prisma.user.findUnique({
      where: { id },
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
            goals: true,
          },
        },
        resources: true,
      },
    });
  }

  async getMentors() {
    return this.prisma.user.findMany({
      where: { role: 'MENTOR' },
      select: {
        id: true,
        name: true,
        email: true,
        profile: {
          select: {
            education: true,
            skills: true,
            interests: true,
          },
        },
        resources: true,
      },
    });
  }

  async getMentorById(mentorId: string) {
    const mentor = await this.prisma.user.findUnique({
      where: { id: mentorId, role: 'MENTOR' },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
        profile: {
          select: {
            education: true,
            skills: true,
            interests: true,
            goals: true,
          },
        },
        resources: {
          select: {
            id: true,
            title: true,
            link: true,
            category: true,
            createdAt: true,
          },
          orderBy: {
            createdAt: 'desc',
          },
        },
      },
    });

    if (!mentor) {
      throw new NotFoundException('Mentor not found');
    }

    return mentor;
  }

  async getStudents() {
    return this.prisma.user.findMany({
      where: { role: 'STUDENT' },
      select: {
        id: true,
        name: true,
        email: true,
        profile: {
          select: {
            education: true,
            skills: true,
            interests: true,
            goals: true,
          },
        },
      },
    });
  }
}
