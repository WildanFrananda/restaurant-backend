interface NotificationEvent {
  type: "newPromo" | "eventUpdated" | "eventPopup"
  data: {
    id: string
    name: string
    description: string
    imageUrl?: string
  }
  timestamp: number
  targetUserId?: string
}

export default NotificationEvent
