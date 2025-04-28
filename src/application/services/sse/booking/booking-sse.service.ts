import { Injectable } from "@nestjs/common"
import BaseSSE from "src/infrastructure/messaging/sse/base.sse"
import BookingSSEEvent from "src/infrastructure/messaging/sse/event/booking/booking.event"

@Injectable()
class BookingSSEService extends BaseSSE<BookingSSEEvent> {
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

  protected override validateEventType(event: BookingSSEEvent): boolean {
    return event.type === "bookingUpdated" || event.type === "bookingCanceled"
  }

  protected override formatEventData(event: BookingSSEEvent): string {
    const formatted = {
      bookingId: event.bookingId,
      newStatus: event.newStatus,
      cancelReason: event.cancelReason,
      updatedAt: event.updatedAt
    }

    return JSON.stringify(formatted)
  }
}

export default BookingSSEService
