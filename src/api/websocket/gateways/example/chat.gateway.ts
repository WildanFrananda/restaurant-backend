// gateway/cluster.gateway.ts
import { WebSocketGateway } from "@nestjs/websockets"
import BaseWebSocketGateway from "src/infrastructure/messaging/websocket/base.gateway"
import ChatEvent from "src/infrastructure/messaging/websocket/event/chat/chat.event"
import WebSocketClient from "src/infrastructure/messaging/websocket/websocket-client"
import { v4 } from "uuid"

interface FileMetadata {
  filename: string
  size: number
  mimeType: string
  room?: string
}

@WebSocketGateway(3080, {
  path: "/ws/chat"
})
export class ChatGateway extends BaseWebSocketGateway<ChatEvent> {
  protected handleMessage(client: WebSocketClient, event: ChatEvent): void {
    try {
      switch (event.type) {
        case "join":
          this.handleJoinRoom(client, event.data.room)
          break

        case "leave":
          this.handleLeaveRoom(client, event.data.room)
          break

        case "message":
          this.handleChatMessage(client, event.data)
          break

        case "error":
          this.logger.error(`Client ${client.id} error: ${event.data.message}`)
          break

        default:
          throw new Error(`Unknown event type`)
      }
    } catch (error: unknown) {
      this.emit(client, "error", {
        message: error,
        code: 500
      })
    }
  }

  protected handleBinaryMessage(
    client: WebSocketClient,
    type: string,
    data: Buffer
  ): void {
    try {
      // First 8 bytes contain metadata length
      const metadataLength = data.readUInt32BE(0)
      const metadataBuffer = data.slice(4, 4 + metadataLength)
      const metadata: FileMetadata = JSON.parse(metadataBuffer.toString("utf8"))

      // Actual file data starts after metadata
      const fileData = data.slice(4 + metadataLength)

      // Store file data (implement your storage logic)
      const fileId = this.handleFileUpload(metadata, fileData)

      // Notify client of successful upload
      this.emit(client, "fileUploaded", {
        fileId,
        filename: metadata.filename,
        size: metadata.size,
        mimeType: metadata.mimeType
      })

      // If this is a room message, broadcast to room
      if (metadata.room) {
        this.to(metadata.room).emit("newFile", {
          fileId,
          filename: metadata.filename,
          size: metadata.size,
          mimeType: metadata.mimeType,
          uploadedBy: client.id
        })
      }
    } catch (error: unknown) {
      this.emit(client, "error", {
        message: `File processing failed: ${String(error)}`,
        code: 500
      })
    }
  }

  private handleJoinRoom(client: WebSocketClient, room: string): void {
    this.roomHandler.join(client, room)
    this.emit(client, "joined", { room })
    this.to(room).emit("userJoined", {
      userId: client.id,
      timestamp: new Date().toISOString()
    })
  }

  private handleLeaveRoom(client: WebSocketClient, room: string): void {
    this.roomHandler.leave(client, room)
    this.emit(client, "left", { room })
    this.to(room).emit("userLeft", {
      userId: client.id,
      timestamp: new Date().toISOString()
    })
  }

  private handleChatMessage(
    client: WebSocketClient,
    data: { content: string; room?: string }
  ): void {
    const messageData = {
      id: v4(),
      content: data.content,
      userId: client.id,
      timestamp: new Date().toISOString()
    }

    if (data.room) {
      this.to(data.room).emit("message", messageData)
    } else {
      this.broadcast("message", messageData)
    }
  }

  private handleFileUpload(metadata: FileMetadata, data: Buffer): string {
    // Implement your file storage logic here
    // This is a simple example that generates a file ID
    return `file_${v4()}`
  }
}
