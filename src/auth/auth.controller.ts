import { Body, Controller, Post, Request, UseGuards, Get, Version, } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersService } from 'src/users/users.service';
import { LocalAuthGuard } from './guard/local-auth.guard';
import { MyAuthGuard } from './guard/My-jwt-auth.guard';
import { LoginUserPayload, RegisterUserPayload, Role, User } from 'src/types';
import { Roles } from './SetMetadata';
import { RolesGuard } from './guard/roles.guard';

@Controller({
  path: 'auth',
  version: ['1']
})

export class AuthController {
  constructor(private authService: AuthService,
    private usersService: UsersService
  ) { }

  @Version('1')
  @Post('login')
  @UseGuards(LocalAuthGuard)
  async signIn(@Body() body: User) {
    return this.authService.signIn(body.username, body.password);
  }

  @Version('1')
  @Post('register')
  async signUp(@Body() body: User) {
    return this.authService.signUp(body);
  }

  @Version('1')
  @Get('profile')
  @Roles(Role.User)
  @UseGuards(RolesGuard)
  getProfile(@Request() req: any) {
    return req.user;
  }
}