import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Patch,
  Req,
  UseGuards,
} from '@nestjs/common';

import { LeavesService } from './leaves.service.js';
import { CreateLeaveDto } from './dto/create-leave.dto.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import { Roles } from '../auth/decorators/roles.decorator.js';
import { Role } from '../users/schemas/user.schema.js';
import { UpdateLeaveDto } from './dto/update-leave.dto.js';

export interface Request {
  user: {
    sub: string;
    role: Role;
  };
}

@Controller('leaves')
@UseGuards(JwtAuthGuard, RolesGuard)
export class LeavesController {
  constructor(private readonly leavesService: LeavesService) {}

  @Post()
  @Roles(Role.EMPLOYEE)
  async create(@Body() dto: CreateLeaveDto, @Req() req: Request) {
    return this.leavesService.create(req.user.sub, dto);
  }

  @Get()
  async findAll(@Req() req: Request) {
    return this.leavesService.findAll(req.user.role, req.user.sub);
  }

  @Get(':id')
  async findById(
    @Param('id', ParseUUIDPipe) id: string,
    @Req() req: Request,
  ) {
    return this.leavesService.findById(id, req.user.role, req.user.sub);
  }

  @Patch(':id/approve')
  @Roles(Role.ADMIN, Role.MANAGER)
  async approve(@Param('id', ParseUUIDPipe) id: string) {
    return this.leavesService.approve(id);
  }

  @Patch(':id/reject')
  @Roles(Role.ADMIN, Role.MANAGER)
  async reject(@Param('id', ParseUUIDPipe) id: string) {
    return this.leavesService.reject(id);
  }

  @Patch(':id/cancel')
  @Roles(Role.EMPLOYEE)
  async cancel(
    @Param('id', ParseUUIDPipe) id: string,
    @Req() req: Request,
  ) {
    return this.leavesService.cancel(id, req.user.sub);
  }

  @Patch(':id/edit')
  @Roles(Role.EMPLOYEE)
  editEmployee(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateLeaveDto, @Req() req: Request) {
    return this.leavesService.editEmployee(id,req.user.sub, dto);
  }
}
