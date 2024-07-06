import { FastifyRequest } from 'fastify';

import { Controller, Get, Req, Version } from '@nestjs/common';
import { AppService } from './app.service';
@Controller({
  version: ['1'],
})
export class AppController {
  constructor(private appService: AppService) { }

  @Version('1')
  @Get()
  LandingPage(@Req() request: FastifyRequest): string {
    console.log(request.cookies);
    return this.appService.render()
  }
}
