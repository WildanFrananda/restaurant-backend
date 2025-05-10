import { Loaded, Reference } from "@mikro-orm/postgresql"
import Booking from "../entities/booking.entity"
import BookingType from "../enums/booking-type.enum"
import Table from "../entities/table.entity"
import BookingStatus from "../enums/booking-status.enum"
import Menu from "../entities/menu.entity"
import ChefLocation from "../enums/chef-location.enum"

abstract class BookingRepository {
  public abstract persistAndFlush(
    data: object | Reference<object> | Iterable<object | Reference<object>>
  ): Promise<void>
  public abstract create(
    user: { id: string },
    type: BookingType,
    schedule: Date,
    status: BookingStatus,
    chefLocation?: ChefLocation,
    table?: Table,
    menu?: Menu,
    location?: string
  ): Booking
  public abstract findUserHistory(
    conditions: Record<string, unknown>,
    limit: number,
    page: number
  ): Promise<[Loaded<Booking, "chef" | "table" | "menu" | "transactions", "*", never>[], number]>
  public abstract filterBookingById(id: string): Promise<Booking | null>
  public abstract findBookingById(id: string): Promise<Booking | null>
  public abstract filterBookingByConditions(
    conditions: Record<string, unknown>
  ): Promise<Booking[] | null>
  public abstract reference(id: string): Booking
}

export default BookingRepository
