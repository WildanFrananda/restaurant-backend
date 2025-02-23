import type { Observable } from "rxjs"
import type { Request } from "express"
import type { MessageEvent } from "@nestjs/common"
import type JwtType from "src/common/types/jwt.type"
import { randomUUID } from "crypto"
import { Controller, ForbiddenException, Req, Sse } from "@nestjs/common"
import AdminWalletSSEService from "src/application/services/sse/admin-wallet-sse.service"
import WalletSSEService from "src/application/services/sse/wallet-sse.service"

@Controller("sse")
class WalletSSEController {
  constructor(
    private readonly walletSSEService: WalletSSEService,
    private readonly adminSSEService: AdminWalletSSEService
  ) {}

  @Sse("wallet")
  public async walletNotification(@Req() req: Request): Promise<Observable<MessageEvent>> {
    const clientId = randomUUID()
    const user = req.user as JwtType

    return await this.walletSSEService.createEventStream(clientId, user)
  }

  @Sse("admin")
  public async adminBookingNotification(@Req() req: Request): Promise<Observable<MessageEvent>> {
    const clientId = randomUUID()
    const user = req.user as JwtType

    if (!user.roles.includes("admin")) {
      throw new ForbiddenException("Admin access required")
    }

    return await this.adminSSEService.createEventStream(clientId, user)
  }
}

export default WalletSSEController
