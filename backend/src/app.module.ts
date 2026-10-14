import { Module } from '@nestjs/common';

import { ConfigModule, ConfigService } from '@nestjs/config';

import { MongooseModule } from '@nestjs/mongoose';

import { AuthModule } from './auth/auth.module.js';
import { UsersModule } from './users/users.module.js';
import { ShiftsModule } from './shifts/shifts.module.js';
import { SchedulingModule } from './scheduling/scheduling.module.js';
import { AssignmentsModule } from './assignments/assignments.module.js';
import { LeavesModule } from './leaves/leaves.module.js';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return {
          uri: configService.getOrThrow<string>('MONGODB_URL'),
        };
      },
    }),
    UsersModule,
    AuthModule,
    ShiftsModule,
    SchedulingModule,
    AssignmentsModule,
    LeavesModule,
  ],
})
export class AppModule {}
