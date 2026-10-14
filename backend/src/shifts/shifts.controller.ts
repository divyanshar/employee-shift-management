import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  UseGuards,
  Patch,
  Delete,
  Req,
} from '@nestjs/common';

import { UpdateShiftDto } from './dto/update-shift.dto.js';
import { ShiftsService } from './shifts.service.js';
import { CreateShiftDto } from './dto/create-shift.dto.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import { Roles } from '../auth/decorators/roles.decorator.js';
import { Role } from '../users/schemas/user.schema.js';
import { Query } from '@nestjs/common';
import { ShiftStatus } from './schemas/shift.schema.js';

interface Request {
  user: {
    sub: string;
    role: Role;
  };
}

@Controller('shifts')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ShiftsController {
  constructor(private readonly shiftsService: ShiftsService) {}

  @Post()
  @Roles(Role.ADMIN, Role.MANAGER)
  async create(@Body() createShiftDto: CreateShiftDto) {
    return this.shiftsService.create(createShiftDto);
  }

  @Get()
  async findAll(
    @Req() req: Request,
    @Query('search') search?: string,
    @Query('status') status?: ShiftStatus,
  ) {
    return this.shiftsService.findAll(
      req.user.role,
      req.user.sub,
      search,
      status,
    );
  }

  @Get('my-schedule')
  @Roles(Role.EMPLOYEE)
  async findMe(@Req() req: Request) {
    return this.shiftsService.findMySchedule(req.user.sub);
  }

  @Get(':id')
  async findById(@Param('id', ParseUUIDPipe) id: string, @Req() req: Request) {
    return this.shiftsService.findById(id, req.user.role, req.user.sub);
  }

  @Patch(':id/complete')
  @Roles(Role.EMPLOYEE)
  async completeShift(@Param('id',ParseUUIDPipe) id: string,@Req() req: Request) {
    return this.shiftsService.completeShift(id,req.user.sub);
  }

  @Patch(':id/cancel')
  @Roles(Role.ADMIN, Role.MANAGER)
  async cancelShift(@Param('id') id: string, @Req() req: Request) {
    return this.shiftsService.cancelShift(id, req.user.role);
  }

  @Patch(':id')
  @Roles(Role.ADMIN, Role.MANAGER)
  async updateShift(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateShiftDto: UpdateShiftDto,
  ) {
    return this.shiftsService.updateShift(id, updateShiftDto);
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  async deleteShift(@Param('id', ParseUUIDPipe) id: string) {
    return this.shiftsService.deleteShift(id);
  }
}
