import WsConfig from "./ws-config.type"

const DEFAULT_WS_CONFIG: WsConfig = {
  maxReconnectAttempts: 5,
  initialReconnectDelay: 1000,
  maxReconnectDelay: 30000,
  binaryOptions: {
    maxSize: 10 * 1024 * 1024, // 10MB
    allowedTypes: ["application/octet-stream", "application/pdf", "image/*"]
  },
  middleware: {
    rateLimit: {
      windowMs: 60000, // 1 minute
      maxRequests: 100
    }
  }
}

export default DEFAULT_WS_CONFIG
