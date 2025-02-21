type AdminBookingNotification = {
  event: "adminBookingNotification"
  bookingId: string
  message: string
  schedule: string
  createdAt: string
}

export default AdminBookingNotification
