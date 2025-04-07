import { Controller, MessageEvent, Req, Sse } from "@nestjs/common"
import { randomUUID } from "crypto"
import { Request } from "express"
import { Observable } from "rxjs"
import EventSSEService from "src/application/services/sse/event/event-sse.service"
import JwtType from "src/common/types/jwt.type"

@Controller("sse")
class EventSSEController {
  constructor(private readonly eventSseService: EventSSEService) {}

  @Sse("events")
  public async eventNotifications(@Req() req: Request): Promise<Observable<MessageEvent>> {
    const clientId = randomUUID()
    const user = req.user as JwtType

    return await this.eventSseService.createEventStream(clientId, user)
  }
}

export default EventSSEController
