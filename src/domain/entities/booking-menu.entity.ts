import {
  Entity,
  ManyToOne,
  PrimaryKey,
  Property
} from "@mikro-orm/core"
import { v4 } from "uuid"
import Booking from "./booking.entity"
import Menu from "./menu.entity"

@Entity()
class BookingMenu {
  @PrimaryKey({ type: "uuid" })
  id: string = v4()

  @ManyToOne(() => Booking)
  booking: Booking

  @ManyToOne(() => Menu)
  menu: Menu

  @Property({ type: "integer" })
  quantity: number = 1

  @Property({ type: "decimal", precision: 10, scale: 2 })
  priceAtBooking: number
}

export default BookingMenu
