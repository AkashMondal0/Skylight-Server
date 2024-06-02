import { Controller, Request, Post, UseGuards, Get } from '@nestjs/common';
import { LocalAuthGuard } from './auth/jwt/local-auth.guard';
import { JwtAuthGuard } from './auth/jwt/jwt-auth.guard';
import { AuthService } from './auth/auth.service';
@Controller()
export class AppController {
  constructor(private authService: AuthService) { }

  @UseGuards(LocalAuthGuard)
  @Post('auth/login')
  async login(@Request() req:any) {
    return this.authService.login(req.user);
  }


  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req: any) {
    return req.user;
  }
}
