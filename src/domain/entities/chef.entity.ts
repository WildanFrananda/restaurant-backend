import { Collection, Entity, Enum, OneToMany, PrimaryKey, Property } from "@mikro-orm/core"
import { v4 } from "uuid"
import ChefStatus from "../enums/chef-status.enum"
import Booking from "./booking.entity"

@Entity()
class Chef {
  @PrimaryKey({ type: "uuid" })
  id: string = v4()

  @Property()
  name: string

  @Property({ type: "text" })
  experience: string

  @Enum(() => ChefStatus)
  status: ChefStatus

  @Property()
  imageUrl: string

  @OneToMany(() => Booking, (booking) => booking.chef)
  bookings = new Collection<Booking>(this)
}

export default Chef
