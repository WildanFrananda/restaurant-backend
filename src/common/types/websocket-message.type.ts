interface WebSocketMessage<T = unknown> {
  event: string
  data: T
}

export default WebSocketMessage
