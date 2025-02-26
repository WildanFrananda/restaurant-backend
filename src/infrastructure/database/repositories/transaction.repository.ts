import type { FilterQuery, Reference } from "@mikro-orm/core"
import { InjectRepository } from "@mikro-orm/nestjs"
import { EntityManager, EntityRepository } from "@mikro-orm/postgresql"
import { Inject, Injectable } from "@nestjs/common"
import type Booking from "src/domain/entities/booking.entity"
import Transaction from "src/domain/entities/transaction.entity"
import type User from "src/domain/entities/user.entity"
import type TransactionFailureReason from "src/domain/enums/transaction-failure-reason.enum"
import type TransactionStatus from "src/domain/enums/transaction-status.enum"
import type TransactionType from "src/domain/enums/transaction-type.enum"
import TransactionRepository from "src/domain/repositories/transaction.repository"

@Injectable()
class TransactionRepositoryImpl extends TransactionRepository {
  constructor(
    @InjectRepository(Transaction)
    private readonly transactionRepository: EntityRepository<Transaction>,
    @Inject(EntityManager)
    private readonly em: EntityManager
  ) {
    super()
  }

  public override async persistAndFlush(
    data: object | Reference<object> | Iterable<object | Reference<object>>
  ): Promise<void> {
    this.em.persist(data)
    await this.em.flush()
  }

  public override createTransaction(
    user: User,
    amount: number,
    type: TransactionType,
    status: TransactionStatus,
    failureReason?: TransactionFailureReason,
    booking?: Booking,
    notes?: string
  ): Transaction {
    const transaction = this.transactionRepository.create({
      user,
      amount,
      type,
      status,
      failureReason,
      booking,
      notes,
      retryCount: 0,
      createdAt: new Date(),
      updatedAt: new Date()
    })

    return transaction
  }

  public override async findUserTransaction(
    userId: string,
    filters: Partial<{
      type: string
      status: string
      startDate: string
      endDate: string
    }>,
    page: number,
    limit: number
  ): Promise<[Transaction[], number]> {
    const conditions: Partial<Record<keyof Transaction, unknown>> = { user: { id: userId } }

    if (filters.type) {
      conditions.type = filters.type as TransactionType
    }

    if (filters.status) {
      conditions.status = filters.status as TransactionStatus
    }

    if (filters.startDate) {
      conditions.createdAt = { $gte: new Date(filters.startDate) }
    }

    if (filters.endDate) {
      if (conditions.createdAt) {
        conditions.createdAt = { ...conditions.createdAt, $lte: new Date(filters.endDate) }
      } else {
        conditions.createdAt = { $lte: new Date(filters.endDate) }
      }
    }

    const [transactions, total] = await this.transactionRepository.findAndCount(
      conditions as FilterQuery<Transaction>,
      {
        populate: ["booking"],
        orderBy: { createdAt: "DESC" },
        limit,
        offset: (page - 1) * limit
      }
    )

    return [transactions, total]
  }
}

export default TransactionRepositoryImpl
