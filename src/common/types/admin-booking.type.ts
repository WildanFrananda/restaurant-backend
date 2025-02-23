type AdminBookingNotification = {
  type: "adminBookingNotification"
  data: {
    bookingId: string
    message: string
    schedule: string
    createdAt: string
  }
  timestamp?: number
}

export default AdminBookingNotification
