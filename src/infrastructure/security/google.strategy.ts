import type { Profile, VerifyCallback } from "passport-google-oauth20"
import { Injectable } from "@nestjs/common"
import { PassportStrategy } from "@nestjs/passport"
import { Strategy } from "passport-google-oauth20"
import AuthService from "src/application/services/auth/auth.service"

@Injectable()
class GoogleStrategy extends PassportStrategy(Strategy, "google") {
  constructor(private readonly authService: AuthService) {
    super({
      clientID: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
      callbackURL: `${process.env.BASE_URL}/api/auth/google/callback`,
      scope: ["email", "profile"]
    })
  }

  public override async validate(
    accessToken: string,
    refreshToken: string,
    profile: Profile,
    done: VerifyCallback
  ): Promise<void> {
    try {
      const user = await this.authService.findOrCreateGoogleUser(profile, accessToken, refreshToken)
      done(null, user)
    } catch (error: unknown) {
      done(error, false)
    }
  }
}

export default GoogleStrategy
