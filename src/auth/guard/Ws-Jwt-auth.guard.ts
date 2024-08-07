import { CanActivate, ExecutionContext, Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { Observable } from 'rxjs';
import * as cookie from 'cookie'; // npm install cookie
import configuration from 'src/configs/configuration';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class WsJwtGuard implements CanActivate {
    constructor(private jwtService: JwtService,
        // private reflector: Reflector
    ) { }
    canActivate(
        context: ExecutionContext,
    ): boolean | Promise<boolean> | Observable<boolean> {
        const client = context.switchToWs().getClient();
        const cookies = cookie.parse(client.handshake.headers.cookie || '');

        // Check if the auth cookie is present and valid
        // This is a simple example, you should replace it with your own logic
        const token = cookies[configuration().COOKIE_NAME];

        if (!token) {
            throw new UnauthorizedException(); 
        }
        const payload = this.jwtService.verify(token, { secret: configuration().JWT_SECRET });
        client.handshake.headers.user = payload
        // Logger.warn(payload)

        return true
    }
}