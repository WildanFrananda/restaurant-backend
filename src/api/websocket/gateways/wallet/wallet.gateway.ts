import { Injectable } from "@nestjs/common"
import { SubscribeMessage, WebSocketGateway } from "@nestjs/websockets"
import { Request } from "express"
import WsAdapterHandler from "src/application/handlers/ws-adapter.handler"
import WsBinary from "src/application/handlers/ws-binary.handler"
import WsConnection from "src/application/handlers/ws-connection.handler"
import WsRoom from "src/application/handlers/ws-room.handler"
import WsConfig from "src/common/config/ws-config.type"
import WsAuthMiddleware from "src/common/middlewares/websocket/ws-auth.middleware"
import WsRateLimiterMiddleware from "src/common/middlewares/websocket/ws-rate-limit.middleware"
import TransactionType from "src/domain/enums/transaction-type.enum"
import BaseWebSocketGateway from "src/infrastructure/messaging/websocket/base.gateway"
import type WalletUpdateEvent from "src/infrastructure/messaging/websocket/event/wallet/wallet-update.event"
import type WalletEvent from "src/infrastructure/messaging/websocket/event/wallet/wallet.event"
import type WebSocketClient from "src/infrastructure/messaging/websocket/websocket-client"

@Injectable()
@WebSocketGateway(3080, {
  path: "ws/wallet"
})
class WalletGateway extends BaseWebSocketGateway<WalletEvent> {
  private readonly userConnections: Map<string, Set<WebSocketClient>> = new Map()

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
    this.logger.log("WalletGateway initialized")
  }

  public override handleConnection(client: WebSocketClient, request: Request): void {
    super.handleConnection(client, request)

    const userData = client.data.get("user") as { id: string }

    if (userData?.id) {
      let userConnections = this.userConnections.get(userData.id)

      if (!userConnections) {
        userConnections = new Set()

        this.userConnections.set(userData.id, userConnections)
      }

      userConnections.add(client)
    }
  }

  public override handleDisconnect(client: WebSocketClient): void {
    const userData = client.data.get("user") as { id: string }

    if (userData?.id) {
      const userConnections = this.userConnections.get(userData.id)

      if (userConnections) {
        userConnections.delete(client)

        if (userConnections.size === 0) {
          this.userConnections.delete(userData.id)
        }
      }
    } else {
      super.handleDisconnect(client)
    }
  }

  protected override handleMessage(client: WebSocketClient, event: WalletEvent) {
    switch (event.type) {
      case "walletUpdated":
        this.handleWalletUpdate(event)
        break
      default:
        this.emit(client, "error", {
          message: `Unknown event type: ${event.type as string}`,
          code: 400
        })
    }
  }

  protected override handleBinaryMessage(
    client: WebSocketClient,
    type: string,
    data: Buffer
  ): void {
    this.emit(client, "error", {
      message: "Binary messages are not supported for wallet updates",
      code: 400
    })
  }

  @SubscribeMessage("walletUpdated")
  public notifyWalletUpdate(walletData: Omit<WalletUpdateEvent, "type">): void {
    this.logger.log(
      `Sending wallet update to user ${walletData.data.userId}: ${JSON.stringify(walletData)}`
    )

    const userConnections = this.userConnections.get(walletData.data.userId)

    if (userConnections) {
      userConnections.forEach((client) => {
        if (client.readyState === client.OPEN) {
          this.emit(client, "walletUpdated", {
            userId: walletData.data.userId,
            newBalance: walletData.data.newBalance,
            amountChanged: walletData.data.amountChanged,
            transactionType: walletData.data.transactionType,
            updatedAt: walletData.data.updatedAt
          })
        }
      })
    }
  }

  private handleWalletUpdate(wallet: Omit<WalletUpdateEvent, "type">): void {
    if (![TransactionType.TOP_UP, TransactionType.PAYMENT].includes(wallet.data.transactionType)) {
      this.logger.error(`Invalid transaction type: ${wallet.data.transactionType}`)

      return
    } else {
      this.notifyWalletUpdate(wallet)
    }
  }
}

export default WalletGateway
