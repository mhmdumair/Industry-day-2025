import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy } from 'passport-google-oauth20';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthService } from '../auth.service'; // Import AuthService

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(
      private configService: ConfigService,
      private authService: AuthService, // Inject AuthService
  ) {
    // @ts-ignore
    super({
      clientID: configService.get<string>('GOOGLE_CLIENT_ID'),
      clientSecret: configService.get<string>('GOOGLE_CLIENT_SECRET'),
      callbackURL: configService.get<string>('GOOGLE_CALLBACK_URL'),
      scope: ['email', 'profile'],
    });
  }

  /**
   * This validate method is now responsible for calling the AuthService
   * to check if the Google user exists in your database.
   */
  async validate(accessToken: string, refreshToken: string, profile: Profile) {
    const email = profile.emails?.[0]?.value;

    if (!email) {
      throw new UnauthorizedException('Could not retrieve email from Google.');
    }

    // Call the service to find the user.
    // The service will throw an error if the user is not found.
    const user = await this.authService.validateGoogleUser({ email });

    // If the service returns a user, Passport.js will attach it to the request.
    return user;
  }
}