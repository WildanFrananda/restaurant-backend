import type JwtType from "src/common/types/jwt.type"
import { Injectable } from "@nestjs/common"
import { PassportStrategy } from "@nestjs/passport"
import { ExtractJwt, Strategy } from "passport-jwt"

@Injectable()
class JwtStrategy extends PassportStrategy(Strategy, "jwt") {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || ""
    })
  }

  public override validate(payload: {
    sub: string
    email: string
    roles: string | string[]
  }): JwtType {
    return {
      userId: payload.sub,
      email: payload.email,
      roles: Array.isArray(payload.roles) ? payload.roles : [payload.roles]
    }
  }
}

export default JwtStrategy
