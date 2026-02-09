import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { MentorshipService } from './mentorship.service';
import { ScheduleSessionDto } from './dto/schedule-session.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@Controller('mentorship')
@UseGuards(JwtAuthGuard)
export class MentorshipController {
  constructor(private readonly mentorshipService: MentorshipService) {}

  // ==================== RESOURCES ====================

  @Get('resources')
  async getMyResources(@CurrentUser() user: any) {
    return this.mentorshipService.getMyResources(user.id);
  }

  @Post('resources')
  async addResource(
    @Body() body: { title: string; link: string; category: string },
    @CurrentUser() user: any,
  ) {
    return this.mentorshipService.addResource(user.id, body);
  }

  @Put('resources/:id')
  async updateResource(
    @Param('id') resourceId: string,
    @Body() body: { title?: string; link?: string; category?: string },
    @CurrentUser() user: any,
  ) {
    return this.mentorshipService.updateResource(user.id, resourceId, body);
  }

  @Delete('resources/:id')
  async deleteResource(
    @Param('id') resourceId: string,
    @CurrentUser() user: any,
  ) {
    return this.mentorshipService.deleteResource(user.id, resourceId);
  }

  // ==================== SESSIONS ====================

  @Post('schedule')
  async scheduleSession(
    @Body() scheduleSessionDto: ScheduleSessionDto,
    @CurrentUser() user: any,
  ) {
    return this.mentorshipService.scheduleSession(scheduleSessionDto);
  }

  @Get('sessions')
  async getSessions(@CurrentUser() user: any) {
    return this.mentorshipService.getSessions(user.id, user.role);
  }

  @Get('sessions/:id')
  async getSession(
    @Param('id') sessionId: string,
    @CurrentUser() user: any,
  ) {
    return this.mentorshipService.getSession(sessionId, user.id, user.role);
  }

  @Post('sessions/:id/join')
  async joinSession(
    @Param('id') sessionId: string,
    @CurrentUser() user: any,
  ) {
    return this.mentorshipService.joinSession(sessionId, user.id);
  }

  @Put('sessions/:id/end')
  async endSession(
    @Param('id') sessionId: string,
    @CurrentUser() user: any,
  ) {
    return this.mentorshipService.endSession(sessionId, user.id, user.role);
  }

  @Put('sessions/:id/cancel')
  async cancelSession(
    @Param('id') sessionId: string,
    @CurrentUser() user: any,
  ) {
    return this.mentorshipService.cancelSession(sessionId, user.id, user.role);
  }

  @Get('sessions/:id/token')
  async getVideoCallToken(
    @Param('id') sessionId: string,
    @CurrentUser() user: any,
  ) {
    return this.mentorshipService.getVideoCallToken(sessionId, user.id);
  }
}
