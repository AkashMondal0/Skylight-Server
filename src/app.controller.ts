import { Controller, Get, Version } from '@nestjs/common';
import { AppService } from './app.service';
@Controller({
  version: ['1'],
})
export class AppController {
  constructor(private appService: AppService) { }

  @Version('1')
  @Get()
  LandingPage(): string {
    return this.appService.render()
  }

}
