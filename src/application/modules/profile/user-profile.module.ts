import { Module } from "@nestjs/common"
import { MikroOrmModule } from "@mikro-orm/nestjs"
import User from "src/domain/entities/user.entity"
import UserProfile from "src/domain/entities/user-profile.entity"
import UserProfileService from "src/application/services/user/user.service"
import UserProfileController from "src/api/http/controllers/user/user.controller"
import UserRepository from "src/domain/repositories/user.repository"
import UserRepositoryImpl from "src/infrastructure/database/repositories/user.repository"

@Module({
  imports: [MikroOrmModule.forFeature([User, UserProfile])],
  providers: [
    {
      provide: UserRepository,
      useClass: UserRepositoryImpl
    },
    UserProfileService
  ],
  controllers: [UserProfileController]
})
export class UserProfileModule {}
