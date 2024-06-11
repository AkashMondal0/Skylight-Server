import { Body, Controller, Post, Request, UseGuards, Get, Version, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Public } from './constants';
import { UsersService } from 'src/users/users.service';
import { AuthGuard } from './guard/auth.guard';

export interface LoginUserPayload {
  username: string;
  password: string;
  id: string;
  email: string;
}
@Controller({
  path: 'auth',
  version: ['1']
})
export class AuthController {
  constructor(private authService: AuthService,
    private usersService: UsersService
  ) { }

  @Public()
  @Version('1')
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async signIn(@Body() body: LoginUserPayload) {
    return this.authService.signIn(body.username, body.password);
  }

  @Version('1')
  @UseGuards(AuthGuard)
  @Get('profile')
  getProfile(@Request() req:any) {
    return req.user;
  }

  // @Version('1')
  // @Get('xyz')
  // @UseGuards(JwtAuthGuard)
  // @Roles(Role.User)
  // getXyz(@Request() req: any) {
  //   return req.user;
  // }
}