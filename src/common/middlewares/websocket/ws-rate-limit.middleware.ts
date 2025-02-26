import { Injectable } from "@nestjs/common"
import WsConfig from "src/common/config/ws-config.type"
import WebSocketClient from "src/infrastructure/messaging/websocket/websocket-client"

@Injectable()
class WsRateLimiterMiddleware {
  private readonly request: Map<string, number[]> = new Map()

  constructor(private readonly config: WsConfig) {}

  public checkRateLimit(client: WebSocketClient): boolean {
    const now = Date.now()
    const windowStart = now - this.config.middleware.rateLimit.windowMs
    let clientRequests = this.request.get(client.id) || []
    clientRequests = clientRequests.filter((timestamp) => timestamp > windowStart)

    if (clientRequests.length >= this.config.middleware.rateLimit.maxRequests) {
      return false
    } else {
      clientRequests.push(now)
      this.request.set(client.id, clientRequests)

      return true
    }
  }

  public clearCheckLimit(client: WebSocketClient): void {
    this.request.delete(client.id)
  }
}

export default WsRateLimiterMiddleware
