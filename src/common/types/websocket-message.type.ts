interface WebSocketMessage<T = unknown> {
  type: string
  data: T
}

export default WebSocketMessage
