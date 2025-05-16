import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException
} from "@nestjs/common"
import CreateReviewDTO from "src/application/dtos/review/create-review.dto"
import GetReviewsDTO from "src/application/dtos/review/get-review.dto"
import UpdateReviewDto from "src/application/dtos/review/update-review.dto"
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

  public async getAllReviews(
    dto: GetReviewsDTO
  ): Promise<{ data: Review[]; total: number; page: number; limit: number }> {
    const { page, limit } = dto
    const [reviews, total] = await this.reviewRepository.findAllReviews(limit, page)

    return { data: reviews, total, page, limit }
  }

  public async getUserReviews(userId: string): Promise<Review[]> {
    return await this.reviewRepository.findUserReviews(userId)
  }

  public async updateReview(
    userId: string,
    reviewId: string,
    dto: UpdateReviewDto
  ): Promise<Review> {
    const { comment, rating } = dto
    const review = await this.reviewRepository.findOneReviewById(reviewId)

    if (!review) {
      throw new NotFoundException("Review not found!")
    }

    if (review.user.id !== userId) {
      throw new ForbiddenException("You are not allowed to update this review!")
    }

    if (rating !== undefined) review.rating = rating
    if (comment !== undefined) review.comment = comment

    await this.reviewRepository.persistAndFlush(review)

    return review
  }

  public async deleteReview(userId: string, reviewId: string): Promise<{ message: string }> {
    const review = await this.reviewRepository.findOneReviewById(reviewId)

    if (!review) {
      throw new NotFoundException("Review not found")
    }
    if (review.user.id !== userId) {
      throw new ForbiddenException("Cannot delete others' review")
    }

    await this.reviewRepository.removeAndFlush(review)

    return { message: "Review deleted successfully" }
  }

  public async getReviewByMenu(menuId: string): Promise<Review[]> {
    return this.reviewRepository.findReviewByMenu(menuId)
  }
}

export default ReviewService
