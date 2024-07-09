import { FastifyRequest, FastifyReply } from 'fastify';
import { Controller, Get, Redirect, Req, Res, Version } from '@nestjs/common';
import { AppService } from './app.service';
import configuration from './configs/configuration';
@Controller({
  version: ['1'],
})
export class AppController {
  constructor(private appService: AppService) { }

  @Version('1')
  @Get()
  LandingPage(@Req() request: FastifyRequest, @Res({ passthrough: true }) response: FastifyReply): any {
    // console.log('Request:', request.cookies)
    // response.setCookie('akash', 'cookieValue', {
    //   path: '/',
    //   secure: true,
    //   httpOnly: true,
    //   expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
    // })
    return this.appService.render()
  }
}
