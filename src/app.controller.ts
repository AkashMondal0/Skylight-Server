import { Controller, Get, Req, Res, Version } from '@nestjs/common';
import { AppService } from './app.service';
import { FastifyReply, FastifyRequest } from 'fastify';
@Controller({
  version: ['1'],
})
export class AppController {
  constructor(private appService: AppService) { }

  @Version('1')
  @Get()
  LandingPage(): any {
    return this.appService.render()
  }

  @Version('1')
  @Get('cookie')
  cookieSet(@Req() request: FastifyRequest,@Res({ passthrough: true }) response: FastifyReply): any {
    return response.send(request.cookies)
  }

  @Version('1')
  @Get("cookie-set")
  findAll(@Res({ passthrough: true }) response: FastifyReply) {
    response.setCookie('test-cookie', 'pompom',{
      domain:"localhost",
      path:"/"
    })
    return response.send(`Cookie value: ${`pompom`}`)
  }
}
