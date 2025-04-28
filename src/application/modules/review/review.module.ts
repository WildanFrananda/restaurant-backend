import { MikroOrmModule } from "@mikro-orm/nestjs"
import { Module } from "@nestjs/common"
import ReviewController from "src/api/http/controllers/review/review.controller"
import ReviewService from "src/application/services/review/review.service"
import Menu from "src/domain/entities/menu.entity"
import Review from "src/domain/entities/review.entity"
import Transaction from "src/domain/entities/transaction.entity"
import UserProfile from "src/domain/entities/user-profile.entity"
import User from "src/domain/entities/user.entity"
import MenuRepository from "src/domain/repositories/menu.repository"
import ReviewRepository from "src/domain/repositories/review.repository"
import TransactionRepository from "src/domain/repositories/transaction.repository"
import UserRepository from "src/domain/repositories/user.repository"
import MenuRepositoryImpl from "src/infrastructure/database/repositories/menu.repository"
import ReviewRepositoryImpl from "src/infrastructure/database/repositories/review.repository"
import TransactionRepositoryImpl from "src/infrastructure/database/repositories/transaction.repository"
import UserRepositoryImpl from "src/infrastructure/database/repositories/user.repository"

@Module({
  imports: [MikroOrmModule.forFeature([Review, User, UserProfile, Menu, Transaction])],
  providers: [
    {
      provide: ReviewRepository,
      useClass: ReviewRepositoryImpl
    },
    {
      provide: MenuRepository,
      useClass: MenuRepositoryImpl
    },
    {
      provide: TransactionRepository,
      useClass: TransactionRepositoryImpl
    },
    {
      provide: UserRepository,
      useClass: UserRepositoryImpl
    },
    ReviewService
  ],
  controllers: [ReviewController],
  exports: [ReviewService]
})
export class ReviewModule {}
