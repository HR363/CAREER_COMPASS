import { Injectable } from '@nestjs/common';
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
