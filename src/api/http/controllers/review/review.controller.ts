import { Body, Controller, Delete, Get, Param, Post, Put, Query, Req } from "@nestjs/common"
import CreateReviewDTO from "src/application/dtos/review/create-review.dto"
import GetReviewsDTO from "src/application/dtos/review/get-review.dto"
import UpdateReviewDto from "src/application/dtos/review/update-review.dto"
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

  @Get()
  public async getAllReviews(
    @Query() dto: GetReviewsDTO
  ): Promise<{ data: Review[]; total: number; page: number; limit: number }> {
    return this.reviewService.getAllReviews(dto)
  }

  @Get(":menuId")
  public async getReviews(@Param("menuId") menuId: string): Promise<Review[]> {
    return this.reviewService.getReviewByMenu(menuId)
  }

  @Get("user")
  public async getUserReviews(@Req() req: AuthenticatedRequest) {
    return this.reviewService.getUserReviews(req.user.userId)
  }

  @Put(":id")
  public async updateReview(
    @Req() req: AuthenticatedRequest,
    @Param("id") id: string,
    @Body() dto: UpdateReviewDto
  ) {
    return this.reviewService.updateReview(req.user.userId, id, dto)
  }

  @Delete(":id")
  public async deleteReview(@Req() req: AuthenticatedRequest, @Param("id") id: string) {
    await this.reviewService.deleteReview(req.user.userId, id)
    return { message: "Review deleted" }
  }
}

export default ReviewController
