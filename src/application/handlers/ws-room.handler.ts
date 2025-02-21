import type WebSocketClient from "src/infrastructure/messaging/websocket/websocket-client"
import { Injectable } from "@nestjs/common"
import { WebSocket } from "ws"

@Injectable()
class WsRoom {
  private readonly rooms: Map<string, Set<WebSocketClient>> = new Map()

  public join(client: WebSocketClient, room: string): void {
    let roomClients = this.rooms.get(room)

    if (!roomClients) {
      roomClients = new Set<WebSocketClient>()

      this.rooms.set(room, roomClients)
    } else {
      roomClients.add(client)
      client.rooms.add(room)
    }
  }

  public leave(client: WebSocketClient, room: string): void {
    const roomClients = this.rooms.get(room)

    if (roomClients) {
      roomClients.delete(client)
      client.rooms.delete(room)

      if (roomClients.size === 0) {
        this.rooms.delete(room)
      }
    }
  }

  public broadcast(room: string, message: string, except?: WebSocketClient): void {
    const roomClients = this.rooms.get(room)

    if (roomClients) {
      roomClients.forEach((client) => {
        if (client !== except && client.readyState === WebSocket.OPEN) {
          client.send(message)
        }
      })
    }
  }

  public leaveAll(client: WebSocketClient): void {
    Array.from(client.rooms).forEach((room) => this.leave(client, room))
  }
}

export default WsRoom
