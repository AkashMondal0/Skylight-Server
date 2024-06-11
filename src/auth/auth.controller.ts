import { Body, Controller, Post, Request, UseGuards, Get, Version, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginUserPayload, Public, RegisterUserPayload } from './constants';
import { UsersService } from 'src/users/users.service';
import { AuthGuard } from './guard/auth.guard';

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

  @Public()
  @Version('1')
  @Post('register')
  @HttpCode(HttpStatus.OK)
  async signUp(@Body() body: RegisterUserPayload) {
    return this.authService.signUp(body);
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