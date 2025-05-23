import { ConflictException, Injectable, UnauthorizedException } from "@nestjs/common"
import { JwtService } from "@nestjs/jwt"
import * as bcrypt from "bcrypt"
import type { Profile } from "passport-google-oauth20"
import type User from "src/domain/entities/user.entity"
import UserRole from "src/domain/enums/user-role.enum"
import UserRepository from "src/domain/repositories/user.repository"

type LoginType = Promise<{
  id: string | undefined
  email: string | undefined
  access_token: string
}>

@Injectable()
class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userRepository: UserRepository
  ) {}

  public async register(name: string, email: string, password: string): Promise<User> {
    const existingUser = await this.userRepository.findUserEmail(email)

    if (existingUser) {
      throw new ConflictException("User Already Exist")
    }

    const salt = await bcrypt.genSalt()
    const hashedPassword = await bcrypt.hash(password, salt)
    const user = await this.userRepository.createUser(
      name,
      email,
      hashedPassword,
      false,
      UserRole.USER
    )

    return user
  }

  public async validateUser(
    email: string,
    password: string
  ): Promise<User | UnauthorizedException> {
    const user = await this.userRepository.findUserEmail(email)

    if (!user) {
      throw new UnauthorizedException("Invalid Credentials")
    }

    if (user.password && !(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException("Invalid Credentials")
    }

    if (!user.isVerified) {
      throw new UnauthorizedException("Please verified your account")
    }

    return user
  }

  public async login(user: Partial<User>): LoginType {
    const payload = {
      email: user.email,
      sub: user.id,
      roles: Array.isArray(user.role) ? user.role : [user.role],
      type: "emailVerification"
    }

    return {
      id: user.id,
      email: user.email,
      access_token: await this.jwtService.signAsync(payload, { expiresIn: "7d" })
    }
  }

  public generateVerificationToken(user: User): string {
    const payload = { sub: user.id, email: user.email, type: "emailVerification" }

    return this.jwtService.sign(payload, { expiresIn: "7d" })
  }

  public async verifyEmailToken(token: string): Promise<boolean> {
    try {
      const payload: { sub: string; email: string; type: string } = this.jwtService.verify(token)

      if (payload.type !== "emailVerification") {
        return false
      }

      const user = await this.userRepository.findUserId(payload.sub)

      if (!user) {
        return false
      }

      user.isVerified = true

      await this.userRepository.persistAndFlush(user)

      return true
    } catch {
      return false
    }
  }

  public async refresh(token: string): Promise<{ access_token: string } | UnauthorizedException> {
    try {
      const payload: { email: string; sub: string; roles: string[] } =
        await this.jwtService.verifyAsync(token)
      const newPayload = { email: payload.email, sub: payload.sub, roles: payload.roles }

      return { access_token: await this.jwtService.signAsync(newPayload) }
    } catch (error) {
      throw new UnauthorizedException(error)
    }
  }

  public async findOrCreateGoogleUser(profile: Profile, accessToken: string, refreshToken: string): Promise<User> {
    const { emails, id, displayName } = profile
    const email = emails && emails.length > 0 ? emails[0].value : ""

    let user = await this.userRepository.findGoogleUser(id, email)

    if (!user) {
      user = await this.userRepository.createUser(displayName, email, "", true, UserRole.USER, id)
    }

    return user
  }
}

export default AuthService
