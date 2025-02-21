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
import Menu from "./menu.entity"
import Transaction from "./transaction.entity"

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

  @ManyToOne(() => Menu, { nullable: true })
  menu?: Menu

  @ManyToOne(() => Chef, { nullable: true })
  chef?: Chef

  @ManyToOne(() => Table, { nullable: true })
  table?: Table

  @Property()
  createdAt: Date = new Date()

  @OneToMany(() => Transaction, (transaction) => transaction.booking)
  transactions = new Collection<Transaction>(this)
}

export default Booking
