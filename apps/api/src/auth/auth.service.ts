import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthService {
  getHello() {
    return { msg: 'Hello World!' };
  }

  googleLogin(): string {
    return 'Google login route is working!';
  }

  googleRedirect(): string {
    return 'Google redirect route is working!';
  }
}
