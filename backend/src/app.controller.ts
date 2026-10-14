// import { Controller, Get } from '@nestjs/common';
// import { AppService } from './app.service.js';

// @Controller()
// export class AppController {
//   constructor(private readonly zappService: AppService) {}

//   @Get()
//   getHello(): string {
//     return this.appService.getHello();
//   }
// }

import {
  Controller,
  Get,
  Req,
  UseGuards,
} from '@nestjs/common';

import { Request } from 'express';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard.js';
import { JwtPayload } from './auth/types/jwt-payload.interface.js';

@Controller()
export class AppController {
  @Get('protected')
  @UseGuards(JwtAuthGuard)
  getProtected(
    @Req() req: Request & { user: JwtPayload },
  ) {
    return {
      message: 'You are authenticated',
      user: req.user,
    };
  }
}