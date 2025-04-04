import { Injectable } from "@nestjs/common"
import { WebSocketGateway } from "@nestjs/websockets"
import { Request } from "express"
import WsAdapterHandler from "src/application/handlers/ws-adapter.handler"
import WsBinary from "src/application/handlers/ws-binary.handler"
import WsConnection from "src/application/handlers/ws-connection.handler"
import WsRoom from "src/application/handlers/ws-room.handler"
import WsConfig from "src/common/config/ws-config.type"
import WsAuthMiddleware from "src/common/middlewares/websocket/ws-auth.middleware"
import WsRateLimiterMiddleware from "src/common/middlewares/websocket/ws-rate-limit.middleware"
import ChefLocation from "src/domain/enums/chef-location.enum"
import ChefStatus from "src/domain/enums/chef-status.enum"
import BaseWebSocketGateway from "src/infrastructure/messaging/websocket/base.gateway"
import ChefEvent from "src/infrastructure/messaging/websocket/event/chef/chef.event"
import WebSocketClient from "src/infrastructure/messaging/websocket/websocket-client"

@Injectable()
@WebSocketGateway(3080, {
  path: "ws/chef",
  cors: true
})
class ChefGateway extends BaseWebSocketGateway<ChefEvent> {
  constructor(
    protected readonly config: WsConfig,
    protected readonly roomHandler: WsRoom,
    protected readonly wsAdapterHandler: WsAdapterHandler,
    protected readonly connectionHandler: WsConnection,
    protected readonly binaryHandler: WsBinary,
    protected readonly authMiddleware: WsAuthMiddleware,
    protected readonly rateLimitMiddleware: WsRateLimiterMiddleware
  ) {
    super(
      config,
      roomHandler,
      wsAdapterHandler,
      connectionHandler,
      binaryHandler,
      authMiddleware,
      rateLimitMiddleware
    )
  }

  public override handleConnection(client: WebSocketClient, request: Request): void {
    super.handleConnection(client, request)

    this.roomHandler.join(client, "chef-status")
  }

  protected override handleMessage(client: WebSocketClient, message: ChefEvent): void {
    try {
      switch (message.type) {
        case "subscribeToChef":
          this.handleSubscribeToChef(client, message.data)
          break
        case "updateChefStatus":
          if ("newStatus" in message.data) {
            this.handleUpdateChefStatus(client, {
              chefId: message.data.chefId,
              status: message.data.newStatus as ChefStatus
            })
          } else {
            this.emit(client, "error", {
              message: "Invalid data for updating chef status",
              code: 400
            })
          }
          break
        case "updateChefLocation":
          if (
            message.data.chefId &&
            message.data.bookingId &&
            "location" in message.data &&
            message.data.location
          ) {
            this.handleUpdateChefLocation(client, {
              chefId: message.data.chefId,
              bookingId: message.data.bookingId,
              location: message.data.location
            })
          } else {
            this.emit(client, "error", {
              message: "Invalid data for updating chef location",
              code: 400
            })
          }
          break
        default:
          this.emit(client, "error", {
            message: "Unknown event type",
            code: 400
          })
      }
    } catch (error: unknown) {
      this.logger.error(`Error handling message: ${String(error)}`)
      this.emit(client, "error", {
        message: "Internal server error",
        code: 500
      })
    }
  }

  protected override handleBinaryMessage(
    client: WebSocketClient,
    type: string,
    data: Buffer
  ): void {
    this.emit(client, "error", {
      message: "Binary messages not supported for chef updated",
      code: 400
    })
  }

  private handleSubscribeToChef(
    client: WebSocketClient,
    data: { chefId: string; bookingId?: string }
  ): void {
    const { chefId, bookingId } = data
    const chefRoom = `chef-${chefId}`

    this.roomHandler.join(client, chefRoom)

    if (bookingId) {
      const bookingRoom = `booking-${bookingId}`

      this.roomHandler.join(client, bookingRoom)
      client.data.set("bookingId", bookingId)
    }

    client.data.set("subscribedChefId", chefId)

    this.emit(client, "subscriptionConfirmed", {
      chefId,
      bookingId,
      message: "Successfully subscribed to chef updated"
    })
  }

  private handleUpdateChefStatus(
    client: WebSocketClient,
    data: { chefId: string; status: ChefStatus }
  ): void {
    const { chefId, status } = data

    this.broadcast(
      "chefStatusUpdated",
      {
        chefId,
        status,
        timestamp: new Date().toISOString()
      },
      "chef-status"
    )
  }

  private handleUpdateChefLocation(
    client: WebSocketClient,
    data: {
      chefId: string
      bookingId: string
      location: ChefLocation
    }
  ): void {
    const { chefId, bookingId, location } = data
    const bookingRoom = `booking-${bookingId}`

    this.broadcast(
      "chefLocationUpdated",
      {
        chefId,
        bookingId,
        location,
        timestamp: new Date().toISOString()
      },
      bookingRoom
    )
  }

  public updateChefStatus(chefId: string, status: ChefStatus): void {
    this.broadcast(
      "chefStatusUpdated",
      {
        chefId,
        status,
        timestamp: new Date().toISOString()
      },
      "chef-status"
    )
  }

  public updateChefLocation(chefId: string, bookingId: string, location: ChefLocation): void {
    const bookingRoom = `booking-${bookingId}`

    this.broadcast(
      "chefLocationUpdated",
      {
        chefId,
        bookingId,
        location,
        timestamp: new Date().toISOString()
      },
      bookingRoom
    )
  }
}

export default ChefGateway
