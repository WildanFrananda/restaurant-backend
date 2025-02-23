interface SSEClient {
  id: string
  userId: string
  roles: string[]
  channels: Set<string>
  connectionTime: number
  reconnectAttempts: number
}

export default SSEClient
