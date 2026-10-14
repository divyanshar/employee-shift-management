// import { Module } from '@nestjs/common';
// import { JwtModule } from '@nestjs/jwt';
// import { ShiftsService } from './shifts.service.js';
// import { ShiftsController } from './shifts.controller.js';
// import { MongooseModule } from '@nestjs/mongoose';
// import { Shift, ShiftSchema } from './schemas/shift.schema.js';
// import { AuthModule } from '../auth/auth.module.js';

// @Module({
//   imports:[MongooseModule.forFeature([{
//     name:Shift.name,
//     schema:ShiftSchema,
//   }]),
// AuthModule, JwtModule],
//   controllers: [ShiftsController],
//   providers: [ShiftsService],
//   exports: [ShiftsService],
// })
// export class ShiftsModule {}


// import { Module } from '@nestjs/common';
// import { MongooseModule } from '@nestjs/mongoose';

// import { Shift, ShiftSchema } from './schemas/shift.schema.js';
// import { ShiftsController } from './shifts.controller.js';
// import { ShiftsService } from './shifts.service.js';

// import { AuthModule } from '../auth/auth.module.js';

// @Module({
//   imports: [
//     MongooseModule.forFeature([
//       {
//         name: Shift.name,
//         schema: ShiftSchema,
//       },
//     ]),
//     AuthModule,
//   ],
//   controllers: [ShiftsController],
//   providers: [ShiftsService],
//   exports: [ShiftsService],
// })
// export class ShiftsModule {}


import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { Shift, ShiftSchema } from './schemas/shift.schema.js';
import { ShiftsController } from './shifts.controller.js';
import { ShiftsService } from './shifts.service.js';

import { AuthModule } from '../auth/auth.module.js';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Shift.name,
        schema: ShiftSchema,
      },
    ]),
    AuthModule,
  ],
  controllers: [ShiftsController],
  providers: [ShiftsService],
  exports: [ShiftsService],
})
export class ShiftsModule {}