import {
  Injectable,
  BadRequestException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Leave, LeaveDocument, LeaveStatus } from './schemas/leave.schema.js';
import { CreateLeaveDto } from './dto/create-leave.dto.js';
import { Role } from '../users/schemas/user.schema.js';
import {
  Shift,
  ShiftDocument,
  ShiftStatus,
} from '../shifts/schemas/shift.schema.js';
import { UpdateLeaveDto } from './dto/update-leave.dto.js';

@Injectable()
export class LeavesService {
  constructor(
    @InjectModel(Leave.name) private readonly leaveModel: Model<LeaveDocument>,
    @InjectModel(Shift.name) private readonly shiftModel: Model<ShiftDocument>,
  ) {}

  // Employee creates a leave request
  async create(
    employeeId: string,
    dto: CreateLeaveDto,
  ): Promise<LeaveDocument> {
    const startDate = new Date(dto.startDate);
    const endDate = new Date(dto.endDate);

    if (startDate > endDate) {
      throw new BadRequestException('Start date cannot be after end date');
    }

    // Prevent overlapping pending or approved requests.
    const overlappingLeave = await this.leaveModel.findOne({
      employeeId,
      status: {
        $in: [LeaveStatus.PENDING, LeaveStatus.APPROVED],
      },
      startDate: { $lte: endDate },
      endDate: { $gte: startDate },
    });

    if (overlappingLeave) {
      throw new BadRequestException(
        'You already have a pending or approved leave request for these dates',
      );
    }

    return this.leaveModel.create({
      employeeId,
      startDate,
      endDate,
      reason: dto.reason,
      status: LeaveStatus.PENDING,
    });
  }

  // Admin/manager see all requests; employees see their own.
  async findAll(role: Role, employeeId: string): Promise<LeaveDocument[]> {
    const filter =
      role === Role.ADMIN || role === Role.MANAGER ? {} : { employeeId };
    return this.leaveModel.find(filter).sort({ createdAt: -1 });
  }
  // Retrieve one request with access checks.
  async findById(
    id: string,
    role: Role,
    employeeId: string,
  ): Promise<LeaveDocument> {
    const leave = await this.leaveModel.findOne({ id });

    if (!leave) {
      throw new NotFoundException('Leave request not found');
    }

    if (
      role !== Role.ADMIN &&
      role !== Role.MANAGER &&
      leave.employeeId !== employeeId
    ) {
      throw new ForbiddenException(
        'You are not allowed to view this leave request',
      );
    }

    return leave;
  }

  // Admin/manager approve a request.
  async approve(id: string): Promise<LeaveDocument> {
    const leave = await this.leaveModel.findOne({ id });

    if (!leave) {
      throw new NotFoundException('Leave request not found');
    }

    if (leave.status !== LeaveStatus.PENDING) {
      throw new BadRequestException(
        'Only pending leave requests can be approved',
      );
    }
    const leaveEndExclusive = new Date(leave.endDate);
    leaveEndExclusive.setUTCDate(leaveEndExclusive.getUTCDate() + 1);
    const conflictingShift = await this.shiftModel
      .findOne({
        employeeId: leave.employeeId,
        status: ShiftStatus.PUBLISHED,
        date: {
          $gte: leave.startDate,
          $lt: leaveEndExclusive,
        },
      });

    if (conflictingShift) {
      throw new BadRequestException(
        'This employee has a published shift during the requested leave. Resolve the shift conflict before approving leave.',
      );
    }

    leave.status = LeaveStatus.APPROVED;
    return leave.save();
  }

  // Admin/manager reject a request.
  async reject(id: string): Promise<LeaveDocument> {
    const leave = await this.leaveModel.findOne({ id });

    if (!leave) {
      throw new NotFoundException('Leave request not found');
    }

    if (leave.status !== LeaveStatus.PENDING) {
      throw new BadRequestException(
        'Only pending leave requests can be rejected',
      );
    }

    leave.status = LeaveStatus.REJECTED;
    return leave.save();
  }

  // Employee cancels their own pending request.
  async cancel(id: string, employeeId: string): Promise<LeaveDocument> {
    const leave = await this.leaveModel.findOne({ id });

    if (!leave) {
      throw new NotFoundException('Leave request not found');
    }

    if (leave.employeeId !== employeeId) {
      throw new ForbiddenException(
        'You can only cancel your own leave requests',
      );
    }

    if (leave.status !== LeaveStatus.PENDING) {
      throw new BadRequestException(
        'Only pending leave requests can be cancelled',
      );
    }

    leave.status = LeaveStatus.CANCELLED;
    return leave.save();
  }

  async editEmployee(id: string, employeeId: string, dto: UpdateLeaveDto) {
    const leave = await this.leaveModel.findOne({ id });
    if (!leave) {throw new NotFoundException("Leave request not found");
    }
    if (leave.employeeId !== employeeId) {
    throw new ForbiddenException(
      "You can only edit your own leave requests",
    );
  }
  if (leave.status !== LeaveStatus.PENDING) {
    throw new BadRequestException(
      "Only pending leave requests can be edited",
    );
  }
  const startDate = new Date(dto.startDate!);
  const endDate = new Date(dto.endDate!);

  if(startDate>endDate){
    throw new BadRequestException('Start date cannot be after end date')
  }
  const overlappingLeave = await this.leaveModel.findOne({
    id: { $ne: id },
    employeeId,
    status: {
      $in: [LeaveStatus.PENDING, LeaveStatus.APPROVED],
    },
    startDate: { $lte: endDate },
    endDate: { $gte: startDate },
  });

  if (overlappingLeave) {
    throw new BadRequestException(
      "You already have a pending or approved leave request for these dates",
    );
  }
  leave.startDate = startDate;
  leave.endDate = endDate;
  leave.reason = dto.reason!;
  return leave.save();
}
}
