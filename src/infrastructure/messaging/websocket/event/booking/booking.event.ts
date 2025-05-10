import BookingCanceledNotification from "./booking-canceled.event"
import BookingCreatedNotification from "./booking-created.event"
import BookingUpdatedNotification from "./booking-update.event"


type BookingEvent =
  | BookingCreatedNotification
  | BookingUpdatedNotification
  | BookingCanceledNotification

export default BookingEvent
