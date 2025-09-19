import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { UserService } from 'src/user/user.service'; // Import UserService
import { User } from 'src/user/entities/user.entity'; // Import User entity

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private configService: ConfigService,
    private readonly userService: UserService, // Inject the UserService
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get('JWT_SECRET'),
    });
  }

  async validate(payload: any) {
    // 1. Validate that the user exists in the database
    const user = await this.userService.fetchUserById(payload.userID);

    // 2. If the user is not found, throw an unauthorized exception
    if (!user) {
      throw new UnauthorizedException();
    }
    
    
    const { password, ...result } = user;
    return result;
  }
}