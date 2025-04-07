import type { EntityName, Reference } from "@mikro-orm/core"
import type Booking from "../entities/booking.entity"
import type Transaction from "../entities/transaction.entity"
import type User from "../entities/user.entity"
import type TransactionFailureReason from "../enums/transaction-failure-reason.enum"
import type TransactionStatus from "../enums/transaction-status.enum"
import type TransactionType from "../enums/transaction-type.enum"

abstract class TransactionRepository {
  abstract persistAndFlush(
    data: object | Reference<object> | Iterable<object | Reference<object>>
  ): Promise<void>
  abstract createTransaction(
    user: User,
    amount: number,
    type: TransactionType,
    status: TransactionStatus,
    failureReason?: TransactionFailureReason,
    booking?: Booking,
    notes?: string
  ): Transaction
  abstract findUserTransaction(
    userId: string,
    filters: Partial<{
      type: string
      status: string
      startDate: string
      endDate: string
    }>,
    page: number,
    limit: number
  ): Promise<[Transaction[], number]>
  public abstract reference(id: string): Transaction
}

export default TransactionRepository
