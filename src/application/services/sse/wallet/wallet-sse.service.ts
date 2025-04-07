import { Injectable } from "@nestjs/common"
import BaseSSE from "src/infrastructure/messaging/sse/base.sse"
import type WalletEvent from "src/infrastructure/messaging/websocket/event/wallet/wallet.event"

@Injectable()
class WalletSSEService extends BaseSSE<WalletEvent> {
  constructor() {
    super({
      bufferSize: 100,
      rateLimit: {
        points: 50,
        duration: 60,
        blockDuration: 120
      }
    })
  }

  protected override validateEventType(event: WalletEvent): boolean {
    return event.type === "walletUpdated"
  }

  protected override formatEventData(event: WalletEvent): string {
    return JSON.stringify(event.data)
  }

  public notifyWalletUpdate(walletUpdate: Omit<WalletEvent, "type">): void {
    const event: WalletEvent = {
      type: "walletUpdated",
      ...walletUpdate,
      timestamp: Date.now()
    }
    const userClientId = this.findClientByUserId(walletUpdate.data.userId)

    if (userClientId) {
      this.eventSubject.next({ ...event, targetUserId: walletUpdate.data.userId })
    }
  }

  private findClientByUserId(userId: string): string | undefined {
    for (const [clientId, client] of this.clients.entries()) {
      if (client.userId === userId) {
        return clientId
      }
    }

    return undefined
  }
}

export default WalletSSEService
