import { Injectable, CanActivate, ExecutionContext, UnauthorizedException, Logger } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { FastifyRequest, FastifyReply } from 'fastify';
import { IS_PUBLIC_KEY, ROLES_KEY } from 'src/auth/SetMetadata';
import configuration from 'src/configs/configuration';
import { Role } from 'src/lib/types';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private jwtService: JwtService,
    private reflector: Reflector
  ) { }

  private extractTokenFromHeader(request: FastifyRequest): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {

    // if request is public, return true
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException();
    }

    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles) {
      return true;
    }

    try {
      const payload = await this.jwtService.verifyAsync(token, { secret: configuration().JWT_SECRET });
      request['user'] = payload;

      return requiredRoles.some((role) => payload?.roles?.includes(role));
    } catch (error) {
      Logger.error(error);
      throw new UnauthorizedException();
    }

  }
}