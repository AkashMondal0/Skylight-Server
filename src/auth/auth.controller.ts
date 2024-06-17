import { Body, Controller, Post, Request, UseGuards, Get, Version, UsePipes, } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Role, User } from 'src/types';
import { Roles } from './SetMetadata';
import { RolesGuard } from './guard/roles.guard';
import { ZodValidationPipe } from 'src/validation/Validation';
import { LoginUserPayload, LoginUserSchema, RegisterUserPayload, RegisterUserSchema } from 'src/validation/ZodSchema';
import { MyAuthGuard } from './guard/My-jwt-auth.guard';
import { SessionUser } from 'src/decorator/session.decorator';

@Controller({
  path: 'auth',
  version: ['1']
})

export class AuthController {
  constructor(private authService: AuthService) { }

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

  // @Version('1')
  // @Post('logout')
  // @UsePipes(new ZodValidationPipe(RegisterUserSchema))
  // async signOut(@Body() body: RegisterUserPayload) {
  //   return this.authService.signOut(body);
  // }

  @Version('1')
  @Get('session')
  @UseGuards(MyAuthGuard)
  getProfile(@SessionUser() User: User) {
    return User;
  }
}