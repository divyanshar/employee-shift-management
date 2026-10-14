import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  Shift,
  ShiftDocument,
  ShiftStatus,
} from '../shifts/schemas/shift.schema.js';
import { Role } from '../users/schemas/user.schema.js';
import { UsersService } from '../users/users.service.js';

import {
  Leave,
  LeaveDocument,
  LeaveStatus,
} from '../leaves/schemas/leave.schema.js';

@Injectable()
export class SchedulingService {
  private readonly MAX_SHIFT_HOURS = 8;
  private readonly MAX_DAILY_HOURS = 8;
  private readonly MAX_WEEKLY_HOURS = 40;
  private readonly MIN_REST_HOURS = 12;

  constructor(
    @InjectModel(Shift.name) private readonly shiftModel: Model<ShiftDocument>,
    @InjectModel(Leave.name) private readonly leaveModel: Model<LeaveDocument>,
    private readonly usersService: UsersService,
  ) {}

  // Convert date and time into JavaScript Date objects.
  private getShiftTimes(shift: ShiftDocument) {
    const start = new Date(shift.date);
    const end = new Date(shift.date);

    const [startHour, startMinute] = shift.startTime.split(':').map(Number);
    const [endHour, endMinute] = shift.endTime.split(':').map(Number);
    start.setHours(startHour, startMinute, 0, 0);
    end.setHours(endHour, endMinute, 0, 0);

    // Handle overnight shifts.
    if (end <= start) {
      end.setDate(end.getDate() + 1);
    }
    return { start, end };
  }
  private async validateLeave(
    employeeId: string,
    shiftDate: Date,
  ): Promise<void> {
    const leave = await this.leaveModel.findOne({
      employeeId,
      status: LeaveStatus.APPROVED,
      startDate: { $lte: shiftDate },
      endDate: { $gte: shiftDate },
    });

    if (leave) {
      throw new BadRequestException(
        'This employee has approved leave on the selected shift date.',
      );
    }
  }

  async validateAssignment(
    shift: ShiftDocument,
    employeeId: string,
  ): Promise<void> {
    const employee = await this.usersService.findById(employeeId);
    if (!employee) {
      throw new NotFoundException('Employee not found');
    }
    if (employee.role !== Role.EMPLOYEE) {
      throw new BadRequestException('Shifts can only be assigned to employees');
    }
    await this.validateLeave(employeeId, shift.date);
    if (shift.status !== ShiftStatus.DRAFT) {
      throw new BadRequestException('Only draft shifts can be assigned');
    }

    const requested = this.getShiftTimes(shift);
    const duration =
      (requested.end.getTime() - requested.start.getTime()) / (1000 * 60 * 60);

    if (duration > this.MAX_SHIFT_HOURS) {
      throw new BadRequestException('Shift duration cannot exceed 8 hours');
    }

    const existingShifts = await this.shiftModel.find({
      employeeId,
      status: {
        $in: [ShiftStatus.PUBLISHED, ShiftStatus.COMPLETED],
      },
    });

    let dailyHours = duration;
    let weeklyHours = duration;

    for (const shiftExist of existingShifts) {
      const existing = this.getShiftTimes(shiftExist);

      if (requested.start < existing.end && requested.end > existing.start) {
        throw new BadRequestException(
          'Employee already has an overlapping shift',
        );
      }

      let restHours: number;
      if (existing.end <= requested.start) {
        restHours =
          (requested.start.getTime() - existing.end.getTime()) /
          (1000 * 60 * 60);
      } else {
        restHours =
          (existing.start.getTime() - requested.end.getTime()) /
          (1000 * 60 * 60);
      }

      if (restHours < this.MIN_REST_HOURS) {
        throw new BadRequestException(
          'Employee must have at least 12 hours of rest between shifts',
        );
      }

      const existingDuration =
        (existing.end.getTime() - existing.start.getTime()) / (1000 * 60 * 60);

      const sameDate =
        new Date(shiftExist.date).toDateString() ===
        new Date(shift.date).toDateString();

      if (sameDate) {
        dailyHours += existingDuration;
      }
      weeklyHours += existingDuration;
    }

    if (dailyHours > this.MAX_DAILY_HOURS) {
      throw new BadRequestException(
        'Employee cannot work more than 8 hours per day',
      );
    }

    if (weeklyHours > this.MAX_WEEKLY_HOURS) {
      throw new BadRequestException(
        'Employee cannot work more than 40 hours per week',
      );
    }
  }
}
