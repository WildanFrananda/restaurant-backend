import type { Server } from "ws"
import type { Request } from "express"
import type WebSocketClient from "./websocket-client"
import type WebSocketMessage from "./websocket-message"
import { OnGatewayConnection, OnGatewayDisconnect, WebSocketServer } from "@nestjs/websockets"
import { Logger } from "@nestjs/common"
import WebSocket from "ws"
import WsRoom from "src/application/handlers/ws-room.handler"
import WsAdapterHandler from "src/application/handlers/ws-adapter.handler"
import BaseEvent from "./event/base.event"
import WsConfig from "src/common/config/ws-config.type"
import WsConnection from "src/application/handlers/ws-connection.handler"
import WsBinary from "src/application/handlers/ws-binary.handler"
import WsAuthMiddleware from "src/common/middlewares/websocket/ws-auth.middleware"
import WsRateLimiterMiddleware from "src/common/middlewares/websocket/ws-rate-limit.middleware"

type ToType = { emit: <T>(type: string, data: T) => void }

abstract class BaseWebSocketGateway<T extends BaseEvent = BaseEvent>
  implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  protected readonly server!: Server

  protected readonly clients: Set<WebSocketClient> = new Set()
  protected readonly logger: Logger = new Logger(this.constructor.name)

  constructor(
    protected readonly config: WsConfig,
    protected readonly roomHandler: WsRoom,
    protected readonly wsAdapterHandler: WsAdapterHandler,
    protected readonly connectionHandler: WsConnection,
    protected readonly binaryHandler: WsBinary,
    protected readonly authMiddleware: WsAuthMiddleware,
    protected readonly rateLimitMiddleware: WsRateLimiterMiddleware
  ) {}

  public async handleConnection(client: WebSocketClient, request: Request): Promise<void> {
    try {
      client.id = this.generateId()
      client.rooms = new Set<string>()
      client.data = new Map<string, unknown>()

      const token = this.extractToken(request)

      await this.authMiddleware.authenticate(client, token)
      this.clients.add(client)
      this.logger.log(`Client connected: ${client.id}`)
      this.setupMessageHandler(client)
      this.setupDisconnectHandler(client)
      this.setupBinaryHandler(client)
    } catch (error: unknown) {
      this.logger.error(`Connection failed: ${client.id} ${error}`)
      client.close(1008, error as string)
    }
  }

  public handleDisconnect(client: WebSocketClient) {
    this.connectionHandler.saveState(client)
    this.roomHandler.leaveAll(client)
    this.rateLimitMiddleware.clearCheckLimit(client)
    this.clients.delete(client)
    this.connectionHandler.handleReconnection(client)
    this.logger.log(`Client disconnected: ${client.id}`)
  }

  protected emit<T>(
    client: WebSocketClient,
    eventName: string,
    data: T,
    callback?: (response: unknown) => void
  ): void {
    const message = {
      event: eventName,
      data,
    }

    if (callback) {
      ;(message as WebSocketMessage).acknowledgementId =
        this.wsAdapterHandler.createAcknowledgement(callback)
    }

    client.send(JSON.stringify(message))
  }

  protected broadcast<T>(type: string, data: T, room?: string): void {
    const message = JSON.stringify({ type, data })

    if (room) {
      this.roomHandler.broadcast(room, message)
    } else {
      this.clients.forEach((client) => {
        if (client.readyState === client.OPEN) {
          client.send(message)
        }
      })
    }
  }

  protected to(room: string): ToType {
    return {
      emit: <T>(type: string, data: T): void => {
        this.broadcast(type, data, room)
      }
    }
  }

  private setupMessageHandler(client: WebSocketClient): void {
    client.on("message", (rawData: WebSocket.RawData) => {
      try {
        if (!this.rateLimitMiddleware.checkRateLimit(client)) {
          this.emit(client, "error", {
            message: "Rate limit exceeded",
            code: 429
          })
        }

        const message = this.parseMessage(rawData)

        if (this.isValidWSEvent(message)) {
          this.handleMessage(client, message)
        } else {
          this.emit(client, "error", {
            message: "Invalid message format",
            code: 400
          })
        }
      } catch (error: unknown) {
        this.logger.error(`Failed to parse message: ${error}`)
        this.emit(client, "error", {
          message: "Message parsing error",
          code: 500
        })
      }
    })
  }

  private setupDisconnectHandler(client: WebSocketClient): void {
    client.on("close", (code: number) => {
      if (code !== 1000) {
        this.connectionHandler.handleReconnection(client)
      } else {
        this.connectionHandler.clearState(client)
      }
    })
  }

  private setupBinaryHandler(client: WebSocketClient): void {
    client.on("message", (data: WebSocket.RawData) => {
      if (data instanceof Buffer) {
        try {
          const { type, data: binaryData } = this.binaryHandler.processBinaryMessage(data)

          this.handleBinaryMessage(client, type, binaryData)
        } catch (error: unknown) {
          this.emit(client, "error", {
            message: error,
            code: 400
          })
        }
      }
    })
  }

  private parseMessage(rawData: WebSocket.RawData): unknown {
    if (rawData instanceof Buffer) {
      return JSON.parse(rawData.toString())
    } else if (typeof rawData === "string") {
      return JSON.parse(rawData)
    } else {
      throw new Error("Unsupported message format")
    }
  }

  private isValidWSEvent(message: unknown): message is T {
    if (typeof message !== "object" || message === null) return false

    const event = message as Partial<BaseEvent>

    return typeof event.type === "string" && event.data !== undefined
  }

  private extractToken(request: Request): string {
    const token = request.headers?.["authorization"]?.replace("Bearer", "")

    if (!token) {
      throw new Error("No authentication token provided")
    } else {
      return token
    }
  }

  protected abstract handleMessage(client: WebSocketClient, message: T): void
  protected abstract handleBinaryMessage(
    client: WebSocketClient,
    type: string,
    data: Buffer
  ): Promise<void>

  private generateId(): string {
    return `ws-${Math.random().toString(36).substring(2, 15)}`
  }
}

export default BaseWebSocketGateway
