import { MikroOrmModule } from "@mikro-orm/nestjs"
import { Module } from "@nestjs/common"
import { JwtModule } from "@nestjs/jwt"
import { PassportModule } from "@nestjs/passport"
import AuthController from "src/api/http/controllers/auth/auth.controller"
import AuthService from "src/application/services/auth/auth.service"
import UserProfile from "src/domain/entities/user-profile.entity"
import User from "src/domain/entities/user.entity"
import UserRepository from "src/domain/repositories/user.repository"
import UserRepositoryImpl from "src/infrastructure/database/repositories/user.repository"
import MailService from "src/infrastructure/mail/mail.service"
import GoogleStrategy from "src/infrastructure/security/google.strategy"
import JwtStrategy from "src/infrastructure/security/jwt.strategy"

@Module({
  imports: [
    MikroOrmModule.forFeature([User, UserProfile]),
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || "SECRET",
      signOptions: { expiresIn: "7d" }
    })
  ],
  providers: [
    {
      provide: UserRepository,
      useClass: UserRepositoryImpl
    },
    AuthService,
    MailService,
    JwtStrategy,
    GoogleStrategy
  ],
  controllers: [AuthController],
  exports: [AuthService]
})
export class AuthModule {}
