import { Body, Controller, Post, Request, UseGuards, Get, Version, UsePipes, } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersService } from 'src/users/users.service';
import { Role, User } from 'src/types';
import { Roles } from './SetMetadata';
import { RolesGuard } from './guard/roles.guard';
import { ZodValidationPipe } from 'src/validation/Validation';
import {  LoginUserPayload, LoginUserSchema, RegisterUserPayload, RegisterUserSchema } from 'src/validation/ZodSchema';

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
  @UsePipes(new ZodValidationPipe(LoginUserSchema))
  async signIn(@Body() body: LoginUserPayload) {
    return this.authService.signIn(body.email, body.password);
  }

  @Version('1')
  @Post('register')
  @UsePipes(new ZodValidationPipe(RegisterUserSchema))
  async signUp(@Body() body: RegisterUserPayload) {
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