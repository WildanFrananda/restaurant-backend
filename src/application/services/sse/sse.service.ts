import { Injectable } from "@nestjs/common"
import { Observable, Subject } from "rxjs"
import AdminBookingNotification from "src/common/types/admin-booking.type"
import WalletUpdateEvent from "src/infrastructure/messaging/websocket/event/wallet/wallet-update.event"

@Injectable()
class SseService {
  private walletNotificationSubject = new Subject<Omit<WalletUpdateEvent, "type">>()
  private adminBookingSubject = new Subject<AdminBookingNotification>()

  public getWalletNotifications(): Observable<Omit<WalletUpdateEvent, "type">> {
    return this.walletNotificationSubject.asObservable()
  }

  public getAdminBookingNotifications(): Observable<AdminBookingNotification> {
    return this.adminBookingSubject.asObservable()
  }

  public notifyWalletUpdate(payload: Omit<WalletUpdateEvent, "type">): void {
    this.walletNotificationSubject.next(payload)
  }

  public notifyAdminBooking(payload: AdminBookingNotification): void {
    this.adminBookingSubject.next(payload)
  }
}

export default SseService
