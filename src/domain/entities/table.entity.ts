import { Collection, Entity, Enum, OneToMany, PrimaryKey, Property } from "@mikro-orm/core"
import TableStatus from "../enums/table-status.enum"
import Booking from "./booking.entity"
import { v4 } from "uuid"

@Entity()
class Table {
  @PrimaryKey({ type: "uuid" })
  id: string = v4()

  @Property()
  tableNumber: string

  @Property()
  capacity: number

  @Enum(() => TableStatus)
  status: TableStatus

  @OneToMany(() => Booking, (booking) => booking.table)
  bookings = new Collection<Booking>(this)
}

export default Table
