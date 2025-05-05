import { Reference } from "@mikro-orm/postgresql"
import BookingMenu from "../entities/booking-menu.entity"
import Booking from "../entities/booking.entity"
import Menu from "../entities/menu.entity"

abstract class BookingMenuRepository {
  public abstract persistAndFlush(
    data: object | Reference<object> | Iterable<object | Reference<object>>
  ): Promise<void>
  public abstract createBookingMenu(
    booking: Booking,
    menu: Menu,
    quantity: number,
    priceAtBooking: number
  ): BookingMenu
  public abstract findByBookingId(bookingId: string): Promise<BookingMenu[] | null>
}

export default BookingMenuRepository
