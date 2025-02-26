import BaseSSE from "src/infrastructure/messaging/sse/base.sse"
import AdminBookingEvent from "src/infrastructure/messaging/sse/event/admin/wallet.event"

class AdminWalletSSEService extends BaseSSE<AdminBookingEvent> {
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

  protected override validateEventType(event: AdminBookingEvent): boolean {
    return event.type === "adminBookingNotification"
  }

  protected override formatEventData(event: AdminBookingEvent): string {
    return JSON.stringify(event.data)
  }

  public notifyAdminsOfWalletUpdate(walletUpdate: Omit<AdminBookingEvent, "type">): void {
    const event: AdminBookingEvent = {
      type: "adminBookingNotification",
      ...walletUpdate,
      timestamp: Date.now()
    }

    this.broadcast(event)
  }
}

export default AdminWalletSSEService
