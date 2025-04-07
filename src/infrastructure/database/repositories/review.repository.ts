import { Reference } from "@mikro-orm/core"
import { EntityName, InjectRepository } from "@mikro-orm/nestjs"
import { EntityManager, EntityRepository } from "@mikro-orm/postgresql"
import { Inject, Injectable } from "@nestjs/common"
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

  public createReview(
    user: User,
    menu: Menu,
    transaction: Transaction,
    rating: number,
    comment?: string
  ): Review {
    return this.reviewRepository.create({
      user,
      menu,
      transaction,
      rating,
      comment,
      createdAt: new Date(),
      updatedAt: new Date()
    })
  }

  public override findOneReviewByTransaction(id: string): Promise<Review | null> {
    return this.reviewRepository.findOne({ transaction: { id: id } })
  }

  public override async findReviewByMenu(menuId: string): Promise<Review[]> {
    return await this.reviewRepository.find(
      { menu: { id: menuId } },
      { orderBy: { createdAt: "DESC" } }
    )
  }

  public override getEntity(): EntityManager {
    return this.reviewRepository.getEntityManager()
  }
}

export default ReviewRepositoryImpl
