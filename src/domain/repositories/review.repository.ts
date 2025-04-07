import { EntityManager, Reference } from "@mikro-orm/postgresql"
import Review from "../entities/review.entity"
import Transaction from "../entities/transaction.entity"
import Menu from "../entities/menu.entity"
import User from "../entities/user.entity"

abstract class ReviewRepository {
  public abstract persistAndFlush(
    data: object | Reference<object> | Iterable<object | Reference<object>>
  ): Promise<void>
  public abstract createReview(
    user: User,
    menu: Menu,
    transaction: Transaction,
    rating: number,
    comment?: string
  ): Review
  public abstract findOneReviewByTransaction(id: string): Promise<Review | null>
  public abstract findReviewByMenu(menuId: string): Promise<Review[]>
  public abstract getEntity(): EntityManager
}

export default ReviewRepository
