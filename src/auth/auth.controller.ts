import { FastifyReply, FastifyRequest } from 'fastify';
import { Body, Controller, Post, Request, UseGuards, Get, Version, UsePipes, Req, Res, } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Role, User } from 'src/types';
import { Roles } from './SetMetadata';
import { RolesGuard } from './guard/roles.guard';
import { ZodValidationPipe } from 'src/validation/Validation';
import { LoginUserPayload, LoginUserSchema, RegisterUserPayload, RegisterUserSchema } from 'src/validation/ZodSchema';
import { MyAuthGuard } from './guard/My-jwt-auth.guard';

@Controller({
  path: 'auth',
  version: ['1']
})

export class AuthController {
  constructor(private authService: AuthService) { }

  @Version('1')
  @Post('login')
  @UsePipes(new ZodValidationPipe(LoginUserSchema))
  async signIn(@Body() body: LoginUserPayload, @Res({ passthrough: true }) response: FastifyReply) {
    return this.authService.signIn(response, body.email, body.password);
  }

  @Version('1')
  @Post('register')
  @UsePipes(new ZodValidationPipe(RegisterUserSchema))
  async signUp(@Body() body: RegisterUserPayload, @Res({ passthrough: true }) response: FastifyReply) {
    return this.authService.signUp(response, body);
  }

  @Version('1')
  @Post('logout')
  @UseGuards(MyAuthGuard)
  async signOut(@Req() request: FastifyRequest,@Res({ passthrough: true }) response: FastifyReply) {
    return this.authService.signOut(request, response);
  }

  @Version('1')
  @Get('session')
  @UseGuards(MyAuthGuard)
  getProfile(@Req() request: FastifyRequest) {
    return request.user;
  }
}