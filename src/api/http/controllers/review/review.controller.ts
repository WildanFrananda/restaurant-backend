import { Body, Controller, Get, Param, Post, Req } from "@nestjs/common"
import CreateReviewDTO from "src/application/dtos/review/create-review.dto"
import ReviewService from "src/application/services/review/review.service"
import AuthenticatedRequest from "src/common/types/user.type"
import Review from "src/domain/entities/review.entity"

@Controller("review")
class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @Post()
  public async createReview(
    @Req() req: AuthenticatedRequest,
    @Body() dto: CreateReviewDTO
  ): Promise<Review> {
    const userId = req.user.userId

    return await this.reviewService.createReview(userId, dto)
  }

  @Get(":menuId")
  public async getReviews(@Param("menuId") menuId: string): Promise<Review[]> {
    return this.reviewService.getReviewByMenu(menuId)
  }
}

export default ReviewController
