import { InjectRepository } from "@mikro-orm/nestjs"
import { EntityManager, EntityRepository, Reference } from "@mikro-orm/postgresql"
import { Inject, Injectable } from "@nestjs/common"
import BookingMenu from "src/domain/entities/booking-menu.entity"
import Booking from "src/domain/entities/booking.entity"
import Menu from "src/domain/entities/menu.entity"
import BookingMenuRepository from "src/domain/repositories/booking-menu.repository"

@Injectable()
class BookingMenuRepositoryImpl extends BookingMenuRepository {
  constructor(
    @InjectRepository(BookingMenu)
    private readonly bookingMenuRepository: EntityRepository<BookingMenu>,
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

  public override createBookingMenu(
    booking: Booking,
    menu: Menu,
    quantity: number,
    priceAtBooking: number
  ): BookingMenu {
    return this.bookingMenuRepository.create({
      booking,
      menu,
      quantity,
      priceAtBooking
    })
  }

  public override findByBookingId(bookingId: string): Promise<BookingMenu[] | null> {
    return this.bookingMenuRepository.find({ booking: { id: bookingId } }, { populate: ["menu"] })
  }
}

export default BookingMenuRepositoryImpl
