import {
  Collection,
  Entity,
  Enum,
  OneToMany,
  OneToOne,
  PrimaryKey,
  Property,
  Cascade
} from "@mikro-orm/core"
import { v4 } from "uuid"
import UserRole from "../enums/user-role.enum"
import UserProfile from "./user-profile.entity"
import Booking from "./booking.entity"
import Transaction from "./transaction.entity"
import Review from "./review.entity"

@Entity()
class User {
  @PrimaryKey({ type: "uuid" })
  id: string = v4()

  @Property({ unique: true })
  email: string

  @Property({ nullable: true })
  password?: string

  @Property({ nullable: true })
  googleId?: string

  @Property({ default: false })
  isVerified: boolean = false

  @Enum(() => UserRole)
  role: UserRole

  @Property()
  createdAt: Date = new Date()

  @OneToOne(() => UserProfile, (profile) => profile.user, {
    mappedBy: "user",
    cascade: [Cascade.PERSIST, Cascade.REMOVE]
  })
  profile?: UserProfile

  @OneToMany(() => Booking, (booking) => booking.user)
  bookings = new Collection<Booking>(this)

  @OneToMany(() => Transaction, (transaction) => transaction.user)
  transactions = new Collection<Transaction>(this)

  @OneToMany(() => Review, (review) => review.user)
  reviews = new Collection<Review>(this)
}

export default User
