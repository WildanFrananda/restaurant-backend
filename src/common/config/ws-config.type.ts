abstract class WsConfig {
  maxReconnectAttempts: number
  initialReconnectDelay: number
  maxReconnectDelay: number
  binaryOptions: {
    maxSize: number // in bytes
    allowedTypes: string[]
  }
  middleware: {
    rateLimit: {
      windowMs: number
      maxRequests: number
    }
  }
}

export default WsConfig
