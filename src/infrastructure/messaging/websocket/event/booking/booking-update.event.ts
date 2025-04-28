import BaseEvent from "../base.event"

interface BookingUpdatedNotification extends BaseEvent {
  type: "bookingUpdated"
  data: {
    bookingId: string
    newStatus: string
    updatedAt: string
    bookingType?: string
    schedule?: string
  }
}

export default BookingUpdatedNotification
