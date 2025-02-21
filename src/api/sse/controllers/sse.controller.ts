import type { MessageEvent } from "@nestjs/common"
import { Controller, Sse } from "@nestjs/common"
import { map, Observable } from "rxjs"
import SseService from "src/application/services/sse/sse.service"

@Controller("sse")
class SseController {
  constructor(private readonly sseService: SseService) {}

  @Sse("wallet")
  public walletNotification(): Observable<MessageEvent> {
    return this.sseService.getWalletNotifications().pipe(map((data) => ({ data })))
  }

  @Sse("admin")
  public adminBookingNotification(): Observable<MessageEvent> {
    return this.sseService.getAdminBookingNotifications().pipe(map((data) => ({ data })))
  }
}

export default SseController
