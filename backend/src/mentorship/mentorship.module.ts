import { Module } from '@nestjs/common';
import { MentorshipController } from './mentorship.controller';
import { MentorshipService } from './mentorship.service';
import { MentorshipGateway } from './mentorship.gateway';

@Module({
  controllers: [MentorshipController],
  providers: [MentorshipService, MentorshipGateway],
  exports: [MentorshipService],
})
export class MentorshipModule {}
