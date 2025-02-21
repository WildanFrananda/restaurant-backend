// gateway/cluster.gateway.ts
import { WebSocketGateway } from "@nestjs/websockets"
import BaseWebSocketGateway from "src/infrastructure/messaging/websocket/base.gateway"
import ChatEvent from "src/infrastructure/messaging/websocket/event/chat/chat.event"
import ChatMessageEvent from "src/infrastructure/messaging/websocket/event/chat/message.event"
import WebSocketClient from "src/infrastructure/messaging/websocket/websocket-client"
import { v4 as uuidv4 } from "uuid"

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
  protected async handleMessage(client: WebSocketClient, event: ChatEvent): Promise<void> {
    try {
      switch (event.type) {
        case "join":
          await this.handleJoinRoom(client, event.data.room)
          break

        case "leave":
          await this.handleLeaveRoom(client, event.data.room)
          break

        case "message":
          const messageEvent = event as ChatMessageEvent

          await this.handleChatMessage(client, messageEvent.data)
          break

        case "error":
          this.logger.error(`Client ${client.id} error: ${event.data.message}`)
          break

        default:
          throw new Error(`Unknown event type`)
      }
    } catch (error) {
      this.emit(client, "error", {
        message: error.message,
        code: 500
      })
    }
  }

  protected async handleBinaryMessage(client: WebSocketClient, type: string, data: Buffer): Promise<void> {
    try {
      // First 8 bytes contain metadata length
      const metadataLength = data.readUInt32BE(0)
      const metadataBuffer = data.slice(4, 4 + metadataLength)
      const metadata: FileMetadata = JSON.parse(metadataBuffer.toString("utf8"))

      // Actual file data starts after metadata
      const fileData = data.slice(4 + metadataLength)

      // Store file data (implement your storage logic)
      const fileId = await this.handleFileUpload(metadata, fileData)

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
    } catch (error) {
      this.emit(client, "error", {
        message: `File processing failed: ${error.message}`,
        code: 500
      })
    }
  }

  private async handleJoinRoom(client: WebSocketClient, room: string): Promise<void> {
    await this.roomHandler.join(client, room)
    this.emit(client, "joined", { room })
    this.to(room).emit("userJoined", {
      userId: client.id,
      timestamp: new Date().toISOString()
    })
  }

  private async handleLeaveRoom(client: WebSocketClient, room: string): Promise<void> {
    await this.roomHandler.leave(client, room)
    this.emit(client, "left", { room })
    this.to(room).emit("userLeft", {
      userId: client.id,
      timestamp: new Date().toISOString()
    })
  }

  private async handleChatMessage(
    client: WebSocketClient,
    data: { content: string; room?: string }
  ): Promise<void> {
    const messageData = {
      id: uuidv4(),
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

  private async handleFileUpload(metadata: FileMetadata, data: Buffer): Promise<string> {
    // Implement your file storage logic here
    // This is a simple example that generates a file ID
    return `file_${uuidv4()}`
  }
}
