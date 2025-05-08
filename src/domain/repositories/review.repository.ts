import { EntityManager, Reference } from "@mikro-orm/postgresql"
import Review from "../entities/review.entity"
import Menu from "../entities/menu.entity"
import User from "../entities/user.entity"
import Booking from "../entities/booking.entity"

abstract class ReviewRepository {
  public abstract persistAndFlush(
    data: object | Reference<object> | Iterable<object | Reference<object>>
  ): Promise<void>
  public abstract createReview(
    user: User,
    menu: Menu,
    booking: Booking,
    rating: number,
    comment?: string
  ): Review
  public abstract findOneReviewByBooking(id: string): Promise<Review | null>
  public abstract findReviewByMenu(menuId: string): Promise<Review[]>
  public abstract getEntity(): EntityManager
}

export default ReviewRepository
