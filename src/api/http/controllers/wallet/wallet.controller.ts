import type AuthenticatedRequest from "src/common/types/user.type"
import type DepositDTO from "src/application/dtos/wallet/deposit.dto"
import type PaymentDTO from "src/application/dtos/wallet/payment.dto"
import { Body, Controller, Post, Req } from "@nestjs/common"
import WalletService from "src/application/services/wallet/wallet.service"

@Controller("wallet")
class WalletController {
  constructor(private readonly walletService: WalletService) {}

  @Post("deposit")
  public async deposit(
    @Req() req: AuthenticatedRequest,
    @Body() body: DepositDTO
  ): Promise<{ message: string }> {
    const { userId } = req.user
    const { amount, notes } = body

    return await this.walletService.deposit(userId, amount, notes)
  }

  @Post("payment")
  public async payment(
    @Req() req: AuthenticatedRequest,
    @Body() body: PaymentDTO
  ): Promise<{ message: string }> {
    const { userId } = req.user
    const { bookingId, amount } = body

    return await this.walletService.payment(userId, bookingId, amount)
  }
}

export default WalletController
