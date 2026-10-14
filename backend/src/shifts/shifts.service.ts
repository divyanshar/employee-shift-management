import {
  Injectable,
  BadRequestException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';

import { Role } from '../users/schemas/user.schema.js';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Shift, ShiftDocument, ShiftStatus } from './schemas/shift.schema.js';
import { UpdateShiftDto } from './dto/update-shift.dto.js';
import { CreateShiftDto } from './dto/create-shift.dto.js';

@Injectable()
export class ShiftsService {
  constructor(
    @InjectModel(Shift.name)
    private readonly shiftModel: Model<ShiftDocument>,
  ) {}

  // Create a new shift
  async create(createShiftDto: CreateShiftDto): Promise<ShiftDocument> {
    return this.shiftModel.create(createShiftDto);
  }

  async findAll(
    role: Role,
    userId: string,
    search?: string,
    status?: ShiftStatus,
  ) {
    const filter: Record<string, unknown> = {};

    // Employees can only see their own assigned shifts.
    if (role === Role.EMPLOYEE) {
      filter.employeeId = userId;
    }

    // Search by title or department.
    if (search?.trim()) {
      const cleanSearch = search.trim();

      filter.$or = [
        { title: { $regex: cleanSearch, $options: 'i' } },
        { department: { $regex: cleanSearch, $options: 'i' } },
      ];
    }
    if (status) {
      filter.status = status;
    }
    return this.shiftModel.find(filter).sort({ date: 1, startTime: 1 });
  }

  async findById(
    id: string,
    role: Role,
    userId: string,
  ): Promise<ShiftDocument> {
    const shift = await this.shiftModel.findOne({ id }).exec();

    if (!shift) {
      throw new NotFoundException('Shift not found');
    }

    if (
      role !== Role.ADMIN &&
      role !== Role.MANAGER &&
      shift.employeeId !== userId
    ) {
      throw new ForbiddenException('You are not allowed to view this shift');
    }

    return shift;
  }
  async completeShift(id: string,employeeId:string): Promise<ShiftDocument> {
    const shift = await this.shiftModel.findOne({ id }).exec();

    if (!shift) {
      throw new NotFoundException('Shift not found');
    }
    if(shift.employeeId!==employeeId){
      throw new ForbiddenException('You can only complete your own assigned shift');
    }

    if (shift.status !== ShiftStatus.PUBLISHED) {
    throw new BadRequestException('Only published shifts can be completed.');
  }
    shift.status = ShiftStatus.COMPLETED;
    return shift.save();
  }
  async cancelShift(id: string, role: Role): Promise<ShiftDocument> {
    const shift = await this.shiftModel.findOne({ id });
    if (!shift) {
      throw new NotFoundException('Shift not found');
    }

    if (
      shift.status !== ShiftStatus.DRAFT &&
      shift.status !== ShiftStatus.PUBLISHED
    ) {
      throw new BadRequestException('This shift cannot be cancelled');
    }

    shift.status = ShiftStatus.CANCELLED;
    return shift.save();
  }

  async updateShift(
    id: string,
    updateShiftDto: UpdateShiftDto,
  ): Promise<ShiftDocument> {
    const shift = await this.shiftModel.findOne({ id });

    if (!shift) {
      throw new NotFoundException('Shift not found');
    }
    
    if (shift.status !== ShiftStatus.DRAFT) {
      throw new BadRequestException('Only draft shifts can be edited');
    }
    Object.assign(shift, updateShiftDto);
    return shift.save();
  }

  async findMySchedule(employeeId: string): Promise<ShiftDocument[]> {
    return await this.shiftModel
      .find({ employeeId })
      .sort({ date: 1, startTime: 1 });
  }

  async deleteShift(id: string) {
    const shift = await this.shiftModel.findOne({ id });
    if (!shift) {
      throw new NotFoundException('Shift not found');
    }
    if (
      shift.status !== ShiftStatus.DRAFT &&
      shift.status !== ShiftStatus.CANCELLED
    ) {
      throw new BadRequestException(
        'Only draft or cancelled shifts can be deleted',
      );
    }
    await this.shiftModel.deleteOne({ id });
    return {
      message: 'Shift deleted successfully',
      id,
    };
  }
}
