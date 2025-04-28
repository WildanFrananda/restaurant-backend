import BaseEvent from "../base.event"

interface BookingCanceledNotification extends BaseEvent {
  type: "bookingCanceled"
  data: {
    bookingId: string
    cancelReason: string
    updatedAt: string
  }
}

export default BookingCanceledNotification
