import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ProfilesModule } from './profiles/profiles.module';
import { AiModule } from './ai/ai.module';
import { MentorshipModule } from './mentorship/mentorship.module';
import { AdminModule } from './admin/admin.module';
import { AgoraModule } from './agora/agora.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: 'config.env',
    }),
    PrismaModule,
    AgoraModule,
    AuthModule,
    UsersModule,
    ProfilesModule,
    AiModule,
    MentorshipModule,
    AdminModule,
  ],
})
export class AppModule {}
