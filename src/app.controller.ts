import { Controller, Get, Req, Res, Version } from '@nestjs/common';
import { AppService } from './app.service';
import { FastifyReply, FastifyRequest } from 'fastify';
import configuration from './configs/configuration';
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
  cookieSet(@Req() request: FastifyRequest, @Res({ passthrough: true }) response: FastifyReply): any {
    return response.send(request.cookies)
  }

  @Version('1')
  @Get("cookie-set")
  findAll(@Res({ passthrough: true }) response: FastifyReply) {
    response.setCookie('test', 'test_page', {
      domain: configuration().DOMAIN,
      path: "/",
      maxAge: 1000 * 60 * 60 * 24 * 30,
      httpOnly: true,
      priority: "medium"
    })
    return response.send(`Cookie value: ${`value`}`)
  }
}
