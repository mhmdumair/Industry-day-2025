import { Injectable, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest<Request>();
    
    // Check for the token in the cookie first
    const tokenFromCookie = request.cookies['access_token'];
    
    // Log the token's origin and value
    if (tokenFromCookie) {
      request.headers.authorization = `Bearer ${tokenFromCookie}`;
    } else {
      const tokenFromHeader = request.headers.authorization;
    }

    // Call the parent canActivate method to handle the authentication.
    return super.canActivate(context);
  }

  handleRequest(err: any, user: any, info: any) {
    if (err || !user) {
      throw err || new UnauthorizedException();
    }
    return user;
  }
}