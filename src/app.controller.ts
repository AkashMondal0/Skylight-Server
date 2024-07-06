import { FastifyRequest, FastifyReply } from 'fastify';

import { Controller, Get, Req, Res, Version } from '@nestjs/common';
import { AppService } from './app.service';
import configuration from './configs/configuration';
@Controller({
  version: ['1'],
})
export class AppController {
  constructor(private appService: AppService) { }

  @Version('1')
  @Get()
  LandingPage(@Req() request: FastifyRequest, @Res({ passthrough: true }) response: FastifyReply): string {
    return this.appService.render()
  }
}
