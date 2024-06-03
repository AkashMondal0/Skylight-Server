import { Controller, Get, Version } from '@nestjs/common';
import { AuthService } from './auth/auth.service';
@Controller({
  version: ['1'],
})
export class AppController {
  constructor(private authService: AuthService) { }
  
  @Version('1')
  @Get()
  LandingPage(): string {
    return 'Welcome to the Chat API';
  }

}
