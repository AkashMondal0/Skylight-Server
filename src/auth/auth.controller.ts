import { Body, Controller, Post, Request, UseGuards, Get, Version } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt/jwt-auth.guard';
import { Roles } from './Role/roles.decorator';
import { Role } from './Role/role.enum';
import { LocalAuthGuard } from './local/local-auth.guard';
import { Public } from './constants';

export interface LoginUserPayload {
  username: string;
  password: string;
  userId: string;
}
@Controller({
  path: 'auth',
  version: ['1']
})
export class AuthController {
  constructor(private authService: AuthService) { }

  @Public() // Ensure this route is not guarded
  @Version('1')
  @Post('login')
  @UseGuards(LocalAuthGuard)
  async loginUser(@Body() body: LoginUserPayload) {
    return this.authService.login(body);
  }

  @Version('1')
  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req: any) {
    return req.user;
  }

  @Version('1')
  @Get('xyz')
  @UseGuards(JwtAuthGuard)
  @Roles(Role.User)
  getXyz(@Request() req: any) {
    return req.user;
  }
}