import BaseSSEEvent from "src/infrastructure/messaging/sse/event/base.event"

type BookingSSEEventType = "bookingUpdated" | "bookingCanceled"

interface BookingSSEEvent extends BaseSSEEvent {
  type: BookingSSEEventType
  id?: string
  targetUserId?: string
  bookingId: string
  newStatus?: string
  cancelReason?: string
  updatedAt: string
}

export default BookingSSEEvent
