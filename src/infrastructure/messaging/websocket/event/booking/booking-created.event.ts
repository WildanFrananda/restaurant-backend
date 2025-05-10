import BaseEvent from "../base.event"

interface BookingCreatedNotification extends BaseEvent {
  type: "bookingCreated"
  data: {
    bookingId: string
    userId: string
    status: string
    type: string
    schedule: string
    totalAmount: number
    createdAt: string
  }
}

export default BookingCreatedNotification