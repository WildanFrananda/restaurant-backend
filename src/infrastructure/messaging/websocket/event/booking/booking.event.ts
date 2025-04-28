import BookingCanceledNotification from "./booking-canceled.event"
import BookingUpdatedNotification from "./booking-update.event"


type BookingEvent =
  | BookingUpdatedNotification
  | BookingCanceledNotification

export default BookingEvent
