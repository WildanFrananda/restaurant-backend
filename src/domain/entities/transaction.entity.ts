import { Entity, Enum, ManyToOne, PrimaryKey, Property } from "@mikro-orm/core"
import { v4 } from "uuid"
import Booking from "./booking.entity"
import TransactionType from "../enums/transaction-type.enum"
import TransactionStatus from "../enums/transaction-status.enum"
import TransactionFailureReason from "../enums/transaction-failure-reason.enum"
import User from "./user.entity"

@Entity()
class Transaction {
  @PrimaryKey({ type: "uuid" })
  id: string = v4()

  @ManyToOne(() => User)
  user: User

  @Property({ type: "decimal", precision: 10, scale: 2 })
  amount: number

  @Enum(() => TransactionType)
  type: TransactionType

  @Enum(() => TransactionStatus)
  status: TransactionStatus

  @Enum(() => TransactionFailureReason)
  failureReason?: TransactionFailureReason

  @Property({ type: "text", nullable: true })
  notes?: string

  @Property()
  retryCount: number = 0

  @ManyToOne(() => Booking, { nullable: true })
  booking?: Booking

  @Property()
  createdAt: Date = new Date()

  @Property({ onUpdate: () => new Date() })
  updatedAt: Date = new Date()
}

export default Transaction
