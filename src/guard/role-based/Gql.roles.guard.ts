import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { GqlExecutionContext } from "@nestjs/graphql";
import { JwtService } from "@nestjs/jwt";
import configuration from "src/configs/configuration";

@Injectable()
export class GqlRolesGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private jwtService: JwtService,
  ) { }

  async canActivate(context: ExecutionContext): Promise<boolean> {

    // const requireRoles = this.reflector.getAllAndOverride<Role[]>('roles', [context.getHandler(), context.getClass()]) // for future use
    // console.log(requireRoles)
    const ctx = GqlExecutionContext.create(context);
    const request = ctx.getContext().req;

    const token = request.cookies[configuration().COOKIE_NAME];

    if (token) {
      const payload = await this.jwtService.verifyAsync(token, { secret: configuration().JWT_SECRET });
      request['user'] = payload;
    }
    return true
  }
}