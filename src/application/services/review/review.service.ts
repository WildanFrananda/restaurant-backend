import { BadRequestException, Injectable } from "@nestjs/common"
import CreateReviewDTO from "src/application/dtos/review/create-review.dto"
import Review from "src/domain/entities/review.entity"
import BookingRepository from "src/domain/repositories/booking.repository"
import MenuRepository from "src/domain/repositories/menu.repository"
import ReviewRepository from "src/domain/repositories/review.repository"
import UserRepository from "src/domain/repositories/user.repository"

@Injectable()
class ReviewService {
  constructor(
    private readonly reviewRepository: ReviewRepository,
    private readonly userRepository: UserRepository,
    private readonly menuRepository: MenuRepository,
    private readonly bookingRepository: BookingRepository
  ) {}

  public async createReview(userId: string, dto: CreateReviewDTO): Promise<Review> {
    const { bookingId, menuId, rating, comment } = dto
    const existingReview = await this.reviewRepository.findOneReviewByBooking(bookingId)

    if (existingReview) {
      throw new BadRequestException("Review for this booking already exist!")
    }

    const userRef = this.userRepository.reference(userId)
    const menuRef = this.menuRepository.reference(menuId)
    const bookingRef = this.bookingRepository.reference(bookingId)
    const review = this.reviewRepository.createReview(userRef, menuRef, bookingRef, rating, comment)

    await this.reviewRepository.persistAndFlush(review)

    return review
  }

  public async getReviewByMenu(menuId: string): Promise<Review[]> {
    return this.reviewRepository.findReviewByMenu(menuId)
  }
}

export default ReviewService
