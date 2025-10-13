import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ScheduleSessionDto } from './dto/schedule-session.dto';
import { SessionStatus } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class MentorshipService {
  constructor(private prisma: PrismaService) {}

  async scheduleSession(dto: ScheduleSessionDto) {
    // Verify mentor exists and is actually a mentor
    const mentor = await this.prisma.user.findUnique({
      where: { id: dto.mentorId, role: 'MENTOR' },
    });

    if (!mentor) {
      throw new NotFoundException('Mentor not found');
    }

    // Verify student exists
    const student = await this.prisma.user.findUnique({
      where: { id: dto.studentId, role: 'STUDENT' },
    });

    if (!student) {
      throw new NotFoundException('Student not found');
    }

    // Generate unique room ID for WebRTC
    const roomId = `room_${uuidv4()}`;

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

  async getSessions(userId: string, userRole: string) {
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

  async getSession(sessionId: string, userId: string, userRole: string) {
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
      throw new NotFoundException('Session not found');
    }

    // Check if user has access to this session
    if (userRole !== 'ADMIN' && session.mentorId !== userId && session.studentId !== userId) {
      throw new ForbiddenException('Access denied to this session');
    }

    return session;
  }

  async joinSession(sessionId: string, userId: string) {
    const session = await this.getSession(sessionId, userId, 'ADMIN'); // This will be overridden by the actual user role

    // Update session status to in progress
    return this.prisma.session.update({
      where: { id: sessionId },
      data: {
        status: 'IN_PROGRESS',
      },
    });
  }

  async endSession(sessionId: string, userId: string, userRole: string) {
    const session = await this.getSession(sessionId, userId, userRole);

    return this.prisma.session.update({
      where: { id: sessionId },
      data: {
        status: 'COMPLETED',
      },
    });
  }

  async cancelSession(sessionId: string, userId: string, userRole: string) {
    const session = await this.getSession(sessionId, userId, userRole);

    return this.prisma.session.update({
      where: { id: sessionId },
      data: {
        status: 'CANCELLED',
      },
    });
  }
}
