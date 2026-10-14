import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { SchedulingService } from './scheduling.service.js';
import { Shift, ShiftSchema } from '../shifts/schemas/shift.schema.js';
import { UsersModule } from '../users/users.module.js';
import { SchedulingController } from './scheduling.controller.js';
import { Leave, LeaveSchema } from '../leaves/schemas/leave.schema.js';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Shift.name,
        schema: ShiftSchema,
      },
      {
        name:Leave.name,
        schema:LeaveSchema,
      },
    ]),
    UsersModule,

  ],
  providers: [SchedulingService],
  exports: [SchedulingService],
  controllers:[SchedulingController]
})
export class SchedulingModule {}