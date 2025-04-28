import { Controller, MessageEvent, Req, Sse } from "@nestjs/common"
import { randomUUID } from "crypto"
import { Request } from "express"
import { Observable } from "rxjs"
import BookingSSEService from "src/application/services/sse/booking/booking-sse.service"
import JwtType from "src/common/types/jwt.type"

@Controller("sse")
class BookingSSEController {
  constructor(private readonly bookingSseService: BookingSSEService) {}

  @Sse("booking")
  public async bookingNotification(@Req() req: Request): Promise<Observable<MessageEvent>> {
    const clientId = randomUUID()
    const user = req.user as JwtType

    return await this.bookingSseService.createEventStream(clientId, user)
  }
}

export default BookingSSEController
