import { Reference } from "@mikro-orm/postgresql"
import Booking from "../entities/booking.entity"

abstract class BookingRepository {
  public abstract persistAndFlush(
    data: object | Reference<object> | Iterable<object | Reference<object>>
  ): Promise<void>
  public abstract findBookingId(id: string): Promise<Booking | null>
}

export default BookingRepository
