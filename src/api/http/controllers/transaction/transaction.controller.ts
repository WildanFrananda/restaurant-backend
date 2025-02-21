import type Transaction from "src/domain/entities/transaction.entity"
import type AuthenticatedRequest from "src/common/types/user.type"
import type GetTransactionDTO from "src/application/dtos/transaction/get-transaction.dto"
import { Controller, Get, Query, Req } from "@nestjs/common"
import TransactionService from "src/application/services/transaction/transaction.service"

@Controller("transaction")
class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @Get()
  public async getTransactions(
    @Req() req: AuthenticatedRequest,
    @Query() query: GetTransactionDTO
  ): Promise<{ data: Transaction[]; total: number; page: number; limit: number }> {
    const { userId } = req.user

    return await this.transactionService.getUserTransaction(userId, query)
  }
}

export default TransactionController
