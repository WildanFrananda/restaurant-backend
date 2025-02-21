import type { Profile, VerifyCallback } from "passport-google-oauth20"
import { Injectable } from "@nestjs/common"
import { PassportStrategy } from "@nestjs/passport"
import { Strategy } from "passport-google-oauth20"

@Injectable()
class GoogleStrategy extends PassportStrategy(Strategy, "google") {
  constructor() {
    super({
      clientID: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
      callbackURL: `${process.env.BASE_URL}/api/auth/google/callback`,
      scope: ["email", "profile"]
    })
  }

  public override validate(
    accessToken: string,
    refreshToken: string,
    profile: Profile,
    done: VerifyCallback
  ): void {
    const { emails, id, displayName } = profile
    const user = {
      email:
        Array.isArray(emails) && emails.length > 0 ? (emails[0] as { value: string }).value : null,
      google_id: id,
      name: displayName,
      accessToken,
      refreshToken
    }

    done(null, user)
  }
}

export default GoogleStrategy
