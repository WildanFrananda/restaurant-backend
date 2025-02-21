import type { Request, Response } from "express"
import type User from "src/domain/entities/user.entity"
import type RegisterDTO from "src/application/dtos/auth/register.dto"
import type LoginDTO from "src/application/dtos/auth/login.dto"
import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  Res,
  UnauthorizedException,
  UseGuards
} from "@nestjs/common"
import { AuthGuard } from "@nestjs/passport"
import AuthService from "src/application/services/auth/auth.service"
import MailService from "src/infrastructure/mail/mail.service"
import { Public } from "src/common/decorators/public.decorator"

type LoginType = Promise<
  | {
      id: string | undefined
      email: string | undefined
      access_token: string
    }
  | { message: string }
>
type RefreshType = Promise<UnauthorizedException | { access_token: string }>

@Controller("auth")
class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly mailService: MailService
  ) {}

  @Public()
  @Post("register")
  public async register(@Body() dto: RegisterDTO): Promise<{ message: string }> {
    const { name, email, password } = dto
    const user = await this.authService.register(name, email, password)
    const verificationToken = this.authService.generateVerificationToken(user)

    await this.mailService.sendVerificationEmail(email, verificationToken)

    return { message: "Registration successful. Please check your email to verify your account" }
  }

  @Public()
  @Post("login")
  public async login(@Body() dto: LoginDTO): LoginType {
    const { email, password } = dto
    const user = await this.authService.validateUser(email, password)

    if (!user) {
      return { message: "Invalid credentials" }
    }

    if (user instanceof UnauthorizedException) {
      throw user
    }

    return this.authService.login(user)
  }

  @Public()
  @Get("verify/:token")
  public async verifyEmail(@Param("token") token: string) {
    const valid = await this.authService.verifyEmailToken(token)

    if (valid) {
      return { message: "Email successfully verified" }
    } else {
      return { message: "Token is invalid or has expired" }
    }
  }

  @Public()
  @Post("refresh")
  public async refresh(@Body() token: string): RefreshType {
    return this.authService.refresh(token)
  }

  @Public()
  @Get("google")
  @UseGuards(AuthGuard("google"))
  public async googleAuth(): Promise<void> {}

  @Public()
  @Get("google/callback")
  @UseGuards(AuthGuard("google"))
  public async googleAuthRedirect(@Req() req: Request, @Res() res: Response) {
    const user = req.user as Partial<User>
    const jwt = await this.authService.login(user)

    return res.redirect(`http://frontend-app.com?token=${jwt.access_token}`)
  }
}

export default AuthController
