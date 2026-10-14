import {
  Controller,
  Get,
  Param,
  Req,
  ParseUUIDPipe,
  UseGuards,
  Delete,
} from '@nestjs/common';
import { UsersService } from './users.service.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import { Role } from './schemas/user.schema.js';
import { Roles } from '../auth/decorators/roles.decorator.js';
import type { Request } from '../leaves/leaves.controller.js';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('employees')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.MANAGER)
  findEmployees() {
    return this.usersService.findEmployees();
  }
  @Delete('employees/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  deleteEmployee(@Param('id', ParseUUIDPipe) id: string) {
    return this.usersService.deleteEmployee(id);
  }
  @Get('me')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.EMPLOYEE)
  async getMyProfile(@Req() req: Request) {
    return this.usersService.findById(req.user.sub);
  }
}
