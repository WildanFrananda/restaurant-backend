interface BaseSSEEvent {
  type: string
  id?: string
  timestamp?: number
  targetUserId?: string
}

export default BaseSSEEvent
