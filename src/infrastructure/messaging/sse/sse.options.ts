interface SSEOptions {
  bufferSize?: number
  reconnectTimeout?: number
  maxReconnectAttempts?: number
  rateLimit?: {
    points: number
    duration: number
    blockDuration: number
  }
}

export default SSEOptions
