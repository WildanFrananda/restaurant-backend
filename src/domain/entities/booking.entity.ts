import {
  Collection,
  Entity,
  Enum,
  ManyToOne,
  OneToMany,
  PrimaryKey,
  Property
} from "@mikro-orm/core"
import { v4 } from "uuid"
import User from "./user.entity"
import Chef from "./chef.entity"
import Table from "./table.entity"
import BookingType from "../enums/booking-type.enum"
import BookingStatus from "../enums/booking-status.enum"
import ChefLocation from "../enums/chef-location.enum"
import Transaction from "./transaction.entity"
import Menu from "./menu.entity"
import BookingMenu from "./booking-menu.entity"

@Entity()
class Booking {
  @PrimaryKey({ type: "uuid" })
  id: string = v4()

  @ManyToOne(() => User)
  user: User

  @Enum(() => BookingType)
  type: BookingType

  @Property()
  schedule: Date

  @Property({ nullable: true })
  location?: string

  @Enum(() => BookingStatus)
  status: BookingStatus

  @Enum(() => ChefLocation)
  chefLocation?: ChefLocation

  @ManyToOne(() => Chef, { nullable: true })
  chef?: Chef

  @ManyToOne(() => Table, { nullable: true })
  table?: Table

  @ManyToOne(() => Menu, { nullable: true })
  menu?: Menu

  @Property({ type: "decimal", precision: 10, scale: 2 })
  totalAmount: number = 0

  @Property()
  createdAt: Date = new Date()

  @OneToMany(() => Transaction, (transaction) => transaction.booking)
  transactions = new Collection<Transaction>(this)

  @OneToMany(() => BookingMenu, (bookingMenu) => bookingMenu.booking)
  bookingMenus = new Collection<BookingMenu>(this)
}

export default Booking