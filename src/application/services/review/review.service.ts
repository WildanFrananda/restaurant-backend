import { BadRequestException, Injectable } from "@nestjs/common"
import CreateReviewDTO from "src/application/dtos/review/create-review.dto"
import Review from "src/domain/entities/review.entity"
import MenuRepository from "src/domain/repositories/menu.repository"
import ReviewRepository from "src/domain/repositories/review.repository"
import TransactionRepository from "src/domain/repositories/transaction.repository"
import UserRepository from "src/domain/repositories/user.repository"

@Injectable()
class ReviewService {
  constructor(
    private readonly reviewRepository: ReviewRepository,
    private readonly userRepository: UserRepository,
    private readonly menuRepository: MenuRepository,
    private readonly transactionRepository: TransactionRepository
  ) {}

  public async createReview(userId: string, dto: CreateReviewDTO): Promise<Review> {
    const { transactionId, menuId, rating, comment } = dto
    const existingReview = await this.reviewRepository.findOneReviewByTransaction(transactionId)

    if (existingReview) {
      throw new BadRequestException("Review for this transaction already exist!")
    }

    const userRef = this.userRepository.reference(userId)
    const menuRef = this.menuRepository.reference(menuId)
    const transactionRef = this.transactionRepository.reference(transactionId)
    const review = this.reviewRepository.createReview(userRef, menuRef, transactionRef, rating, comment)

    await this.reviewRepository.persistAndFlush(review)

    return review
  }

  public async getReviewByMenu(menuId: string): Promise<Review[]> {
    return this.reviewRepository.findReviewByMenu(menuId)
  }
}

export default ReviewService
