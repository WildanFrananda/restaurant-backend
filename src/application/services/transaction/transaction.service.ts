import type GetTransactionDTO from "src/application/dtos/transaction/get-transaction.dto"
import TransactionRepository from "src/domain/repositories/transaction.repository"
import { Injectable } from "@nestjs/common"
import Transaction from "src/domain/entities/transaction.entity"

type UserTransactionType = Promise<{
  data: Transaction[]
  total: number
  page: number
  limit: number
}>

@Injectable()
class TransactionService {
  constructor(private readonly transactionRepository: TransactionRepository) {}

  public async getUserTransaction(userId: string, query: GetTransactionDTO): UserTransactionType {
    const page = query.page || 1
    const limit = query.limit || 10
    const filters = {
      type: query.type,
      status: query.status,
      startDate: query.startDate,
      endDate: query.endDate
    }

    const [transactions, total] = await this.transactionRepository.findUserTransaction(
      userId,
      filters,
      page,
      limit
    )

    return { data: transactions, total, page, limit }
  }
}

export default TransactionService
