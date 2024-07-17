import { AuthenticationError } from "@nestjs/apollo";
import { Injectable, ExecutionContext } from "@nestjs/common";
import { GqlExecutionContext } from "@nestjs/graphql";
import { AuthGuard } from "@nestjs/passport";


@Injectable()
export class GqlAuthGuard extends AuthGuard('jwt') {
  getRequest(context: ExecutionContext) {
    const ctx = GqlExecutionContext.create(context);
    const request = ctx.getContext().req;

    // Get the token from the cookies
    const token = request.cookies['auth-session-token'];

    if (token) {
      // Add the token to the request headers
      request.headers.authorization = `Bearer ${token}`;
      return request;
    }

    if (!request.headers.authorization) {
      throw new AuthenticationError('You are not logged-in.');
    }
    return request;
  }
}