import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy } from 'passport-google-oauth20';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy) {
  constructor(private configService: ConfigService) {
    //@ts-ignore
    super({
      clientID: configService.get<string>('GOOGLE_CLIENT_ID'),
      clientSecret: configService.get<string>('GOOGLE_CLIENT_SECRET'),
      callbackURL: configService.get<string>('GOOGLE_CALLBACK_URL'),
      scope: ['email', 'profile'],
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: Profile) {
    const email = profile.emails?.[0]?.value;
    const firstName = profile.name?.givenName;
    const lastName = profile.name?.familyName;
    const profilePicture = profile.photos?.[0]?.value;

    if (!email || !firstName || !lastName) {
      throw new Error('Required profile information missing from Google');
    }

    return {
      google_id: profile.id,
      email: email,
      first_name: firstName,
      last_name: lastName,
      profile_picture: profilePicture,
      accessToken,
    };
  }
}
