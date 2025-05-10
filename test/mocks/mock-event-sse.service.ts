import { Injectable, MessageEvent } from "@nestjs/common"
import { RateLimiterMemory } from "rate-limiter-flexible"
import { filter, map, Observable, Subject } from "rxjs"
import EventSSEService from "src/application/services/sse/event/event-sse.service"
import JwtType from "src/common/types/jwt.type"
import NotificationEvent from "src/infrastructure/messaging/sse/event/notification/notification.event"
import SSEClient from "src/infrastructure/messaging/sse/sse-client.event"

@Injectable()
class MockEventSSEService extends EventSSEService {
  protected readonly eventSubject = new Subject<NotificationEvent>()
  protected readonly clients = new Map<string, SSEClient>()
  protected readonly rateLimiter: RateLimiterMemory

  public validateEventTypePublic(...args: Parameters<EventSSEService["validateEventType"]>) {
    return this.validateEventType(...args)
  }

  public formatEventData(...args: Parameters<EventSSEService["validateEventType"]>): string {
    return this.formatEventData(...args)
  }

  public async createEventStream(
    clientId: string,
    user: JwtType
  ): Promise<Observable<MessageEvent>> {
    this.clients.set(clientId, {
      id: clientId,
      userId: user.userId,
      roles: user.roles || [],
      channels: new Set<string>(),
      connectionTime: Date.now(),
      reconnectAttempts: 0
    })

    await this.rateLimiter.consume(user.userId)

    const observable = this.eventSubject.pipe(
      filter((event) => {
        if (event.targetUserId) {
          return event.targetUserId === user.userId
        }

        return true
      }),
      map((event) => ({
        data: JSON.stringify(event.data),
        id: event.data.id || Date.now().toString(),
        type: event.type,
        retry: 5000
      }))
    )

    return observable
  }

  public notifyEvent(eventUpdate: Omit<NotificationEvent, "timestamp">): void {
    const event: NotificationEvent = {
      ...eventUpdate,
      timestamp: Date.now()
    }

    this.eventSubject.next(event)
  }

  public handleDisconnection(clientId: string): void {
    this.clients.delete(clientId)
  }
}

export default MockEventSSEService
