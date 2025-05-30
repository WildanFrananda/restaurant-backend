import { Loaded, Reference } from "@mikro-orm/core"
import { EntityName, InjectRepository } from "@mikro-orm/nestjs"
import { EntityManager, EntityRepository } from "@mikro-orm/postgresql"
import { Inject, Injectable } from "@nestjs/common"
import Booking from "src/domain/entities/booking.entity"
import Menu from "src/domain/entities/menu.entity"
import Review from "src/domain/entities/review.entity"
import Transaction from "src/domain/entities/transaction.entity"
import User from "src/domain/entities/user.entity"
import ReviewRepository from "src/domain/repositories/review.repository"

@Injectable()
class ReviewRepositoryImpl extends ReviewRepository {
  constructor(
    @InjectRepository(Review)
    private readonly reviewRepository: EntityRepository<Review>,
    @Inject(EntityManager)
    private readonly em: EntityManager
  ) {
    super()
  }

  public override async persistAndFlush(
    data: object | Reference<object> | Iterable<object | Reference<object>>
  ): Promise<void> {
    this.em.persist(data)
    await this.em.flush()
  }

  public override async removeAndFlush(
    data: object | Reference<object> | Iterable<object | Reference<object>>
  ): Promise<void> {
    this.em.remove(data)
    await this.em.flush()
  }

  public override createReview(
    user: User,
    menu: Menu,
    booking: Booking,
    rating: number,
    comment?: string
  ): Review {
    return this.reviewRepository.create({
      user,
      menu,
      booking,
      rating,
      comment,
      createdAt: new Date(),
      updatedAt: new Date()
    })
  }

  public findAllReviews(
    limit: number,
    page: number
  ) {
    return this.reviewRepository.findAndCount(
      {},
      {
        limit,
        offset: (page - 1) * limit,
        populate: ["user.profile", "menu"],
        orderBy: { createdAt: "DESC" }
      }
    )
  }

  public override findOneReviewByBooking(id: string): Promise<Review | null> {
    return this.reviewRepository.findOne({ booking: { id: id } })
  }

  public override async findReviewByMenu(menuId: string): Promise<Review[]> {
    return await this.reviewRepository.find(
      { menu: { id: menuId } },
      { orderBy: { createdAt: "DESC" } }
    )
  }

  public override async findUserReviews(userId: string): Promise<Review[]> {
    return await this.reviewRepository.find({ user: { id: userId } })
  }

  public override async findOneReviewById(id: string): Promise<Review | null> {
    return await this.reviewRepository.findOne({ id }, { populate: ["user.profile"] })
  }

  public override getEntity(): EntityManager {
    return this.reviewRepository.getEntityManager()
  }
}

export default ReviewRepositoryImpl
