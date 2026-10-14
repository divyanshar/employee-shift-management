import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Leave, LeaveSchema } from './schemas/leave.schema.js';
import { LeavesController } from './leaves.controller.js';
import { LeavesService } from './leaves.service.js';

import { Shift, ShiftSchema } from '../shifts/schemas/shift.schema.js';
import { AuthModule } from '../auth/auth.module.js';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Leave.name,
        schema: LeaveSchema,
      },
      {
        name: Shift.name,
        schema: ShiftSchema,
      },
    ]),
    AuthModule,
  ],
  controllers: [LeavesController],
  providers: [LeavesService],
  exports: [LeavesService],
})
export class LeavesModule {}