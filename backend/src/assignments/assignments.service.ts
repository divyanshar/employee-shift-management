import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';

import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import {
  Shift,
  ShiftDocument,
  ShiftStatus,
} from '../shifts/schemas/shift.schema.js';

import { SchedulingService } from '../scheduling/scheduling.service.js';

@Injectable()
export class AssignmentsService {
  constructor(
    @InjectModel(Shift.name)
    private readonly shiftModel: Model<ShiftDocument>,
    private readonly schedulingService: SchedulingService,
  ) {}

  async assignShift(
    shiftId: string,
    employeeId: string,
  ): Promise<ShiftDocument> {
    const shift = await this.shiftModel.findOne({ id: shiftId });
    if (!shift) {
      throw new NotFoundException('Shift not found');
    }
    if (shift.status !== ShiftStatus.DRAFT) {
      throw new BadRequestException('Only draft shifts can be assigned');
    }

    if (shift.employeeId) {
      throw new BadRequestException(
        'This shift already has an assigned employee',
      );
    }
    await this.schedulingService.validateAssignment(shift, employeeId);
    shift.employeeId = employeeId;
    shift.status = ShiftStatus.PUBLISHED;
    return await shift.save();
  }
}
