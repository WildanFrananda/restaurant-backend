interface WebSocketMessage<T = unknown> {
  event: string
  data: T
  room?: string
  acknowledgementId?: string
}

export default WebSocketMessage
