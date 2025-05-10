import { Injectable } from "@nestjs/common"
import { WebSocketGateway, WebSocketServer } from "@nestjs/websockets"
import WsAdapterHandler from "src/application/handlers/ws-adapter.handler"
import WsBinary from "src/application/handlers/ws-binary.handler"
import WsConnection from "src/application/handlers/ws-connection.handler"
import WsRoom from "src/application/handlers/ws-room.handler"
import WsConfig from "src/common/config/ws-config.type"
import WsAuthMiddleware from "src/common/middlewares/websocket/ws-auth.middleware"
import WsRateLimiterMiddleware from "src/common/middlewares/websocket/ws-rate-limit.middleware"
import Booking from "src/domain/entities/booking.entity"
import BaseWebSocketGateway from "src/infrastructure/messaging/websocket/base.gateway"
import BookingEvent from "src/infrastructure/messaging/websocket/event/booking/booking.event"
import WebSocketClient from "src/infrastructure/messaging/websocket/websocket-client"
import { Server } from "ws"

@Injectable()
@WebSocketGateway(3080, {
  path: "ws/booking",
  cors: true
})
class BookingGateway extends BaseWebSocketGateway<BookingEvent> {
  @WebSocketServer()
  protected readonly server!: Server

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

  protected override handleMessage(client: WebSocketClient, message: BookingEvent): void {
    if (message.type === "bookingUpdated" || message.type === "bookingCanceled") {
      this.broadcast(message.type, message.data)
    } else {
      this.emit(client, "error", { message: `Unknown event type`, code: 400 })
    }
  }

  protected override handleBinaryMessage(
    client: WebSocketClient,
    type: string,
    data: Buffer
  ): void {
    this.emit(client, "error", {
      message: "Binary message is not supported for booking events",
      code: 400
    })
  }

  public sendBookingCreated(booking: Booking): void {
    const data = {
      bookingId: booking.id,
      userId: booking.user.id,
      status: booking.status,
      type: booking.type,
      schedule: booking.schedule.toISOString(),
      totalAmount: booking.totalAmount,
      createdAt: new Date().toISOString()
    }

    this.broadcast("bookingCreated", data)
    this.logger.log(`Broadcasted bookingCreated event for booking ${booking.id}`)
  }

  public notifyUser(userId: string, eventType: string, data: Record<string, unknown>): void {
    let notifiedCount = 0

    this.clients.forEach((client) => {
      if (client.data.get("userId") === userId && client.readyState === client.OPEN) {
        this.emit(client, eventType, data)
        notifiedCount++
      }
    })

    this.logger.log(
      `Sent ${eventType} notification to user ${userId} (${notifiedCount} active connections)`
    )
  }

  public sendBookingStatusUpdate(bookingId: string, newStatus: string, userId?: string): void {
    const data = {
      bookingId,
      newStatus,
      updatedAt: new Date().toISOString()
    }

    this.broadcast("bookingUpdated", data)

    if (userId) {
      const personalData = {
        ...data,
        message: `Your booking status has been updated to ${newStatus}`
      }

      this.notifyUser(userId, "bookingUpdated", personalData)
    }

    this.logger.log(`Sent bookingUpdated event for booking ${bookingId} with status ${newStatus}`)
  }

  public joinBookingRoom(client: WebSocketClient, bookingId: string): void {
    const roomName = `booking:${bookingId}`
    this.roomHandler.join(client, roomName)
    this.logger.log(`Client ${client.id} joined room ${roomName}`)
  }
}

export default BookingGateway
