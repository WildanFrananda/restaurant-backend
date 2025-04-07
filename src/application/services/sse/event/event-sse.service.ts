import type NotificationEvent from "src/infrastructure/messaging/sse/event/notification/notification.event"
import { Injectable } from "@nestjs/common"
import BaseSSE from "src/infrastructure/messaging/sse/base.sse"

@Injectable()
class EventSSEService extends BaseSSE<NotificationEvent> {
  constructor() {
    super({
      bufferSize: 100,
      rateLimit: {
        points: 100,
        duration: 60,
        blockDuration: 120
      },
      reconnectTimeout: 5000
    })
  }

  protected override validateEventType(event: NotificationEvent): boolean {
    return ["newPromo", "eventUpdated", "eventPopup"].includes(event.type)
  }

  protected override formatEventData(event: NotificationEvent): string {
    return JSON.stringify(event.data)
  }

  public notifyEvent(eventUpdate: Omit<NotificationEvent, "timestamp">): void {
    const event: NotificationEvent = {
      ...eventUpdate,
      timestamp: Date.now()
    }

    this.eventSubject.next(event)
  }
}

export default EventSSEService
