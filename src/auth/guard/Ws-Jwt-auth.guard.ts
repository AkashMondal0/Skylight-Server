import { CanActivate, ExecutionContext, Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { Observable } from 'rxjs';
import * as cookie from 'cookie'; // npm install cookie
import configuration from 'src/configs/configuration';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class WsJwtGuard implements CanActivate {
    constructor(private jwtService: JwtService) { }
    canActivate(
        context: ExecutionContext,
    ): boolean | Promise<boolean> | Observable<boolean> {
        const client = context.switchToWs().getClient();
        let header = client.handshake.headers;

        if (!header?.authorization) {
            const cookies = cookie.parse(header.cookie ?? '');
            const token = cookies[configuration().COOKIE_NAME];
            if (!token) {
                Logger.error('Unauthorized access');
                throw new UnauthorizedException();
            }
            header.authorization = token;
        }

        const payload = this.jwtService.verify(header.authorization, { secret: configuration().JWT_SECRET });
        client.handshake.headers.user = payload;

        return true
    }
}