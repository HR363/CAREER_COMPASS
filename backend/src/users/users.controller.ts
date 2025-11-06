import { Controller, Get, UseGuards, Query } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  async findAll(@Query('role') role?: string) {
    return this.usersService.findAll(role);
  }

  @Get('mentors')
  async getMentors() {
    return this.usersService.getMentors();
  }

  @Get('students')
  @UseGuards(RolesGuard)
  @Roles('ADMIN', 'MENTOR')
  async getStudents() {
    return this.usersService.getStudents();
  }
}
