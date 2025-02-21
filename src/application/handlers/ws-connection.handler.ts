import type WebSocketClient from "src/infrastructure/messaging/websocket/websocket-client"
import { Injectable } from "@nestjs/common"
import WsConfig from "src/common/config/ws-config.type"

@Injectable()
class WsConnection {
  private reconnectAttempts: Map<string, number> = new Map()
  private lastStates: Map<string, unknown> = new Map()

  constructor(private readonly config: WsConfig) {}

  public handleReconnection(client: WebSocketClient): void {
    const attempts = this.reconnectAttempts.get(client.id) || 0

    if (attempts >= this.config.maxReconnectAttempts) {
      this.reconnectAttempts.delete(client.id)
      return
    } else {
      const delay = Math.min(
        this.config.initialReconnectDelay * Math.pow(2, attempts),
        this.config.maxReconnectDelay
      )

      this.reconnectAttempts.set(client.id, attempts + 1)

      setTimeout(() => {
        if (client.readyState === client.CLOSED) {
          client.removeAllListeners()

          const savedState = this.lastStates.get(client.id)

          if (savedState) {
            client.data = new Map(Object.entries(savedState))
          }
        }
      }, delay)
    }
  }

  public saveState(client: WebSocketClient): void {
    this.lastStates.set(client.id, Object.fromEntries(client.data))
  }

  public clearState(client: WebSocketClient): void {
    this.lastStates.delete(client.id)
    this.reconnectAttempts.delete(client.id)
  }
}

export default WsConnection
