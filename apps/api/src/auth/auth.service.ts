import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthService {
  getHello(): string {
    return 'Hello from Auth Service!';
  }

  googleLogin(): string {
    return 'Google login route is working!';
  }

  googleRedirect(): string {
    return 'Google redirect route is working!';
  }
}
