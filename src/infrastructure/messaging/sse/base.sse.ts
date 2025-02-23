import type { MessageEvent } from "@nestjs/common"
import type BaseSSEEvent from "./event/base.event"
import type SSEClient from "./sse-client.event"
import { HttpException, HttpStatus, Logger } from "@nestjs/common"
import { filter, map, Observable, Subject } from "rxjs"
import { RateLimiterMemory, RateLimiterRes } from "rate-limiter-flexible"
import SSEOptions from "./sse.options"
import JwtType from "src/common/types/jwt.type"

abstract class BaseSSE<T extends BaseSSEEvent> {
  protected readonly clients: Map<string, SSEClient> = new Map()
  protected readonly eventSubject: Subject<T> = new Subject()
  protected readonly logger = new Logger(this.constructor.name)
  protected readonly rateLimiter: RateLimiterMemory

  constructor(protected readonly options: SSEOptions = {}) {
    this.rateLimiter = new RateLimiterMemory({
      points: options.rateLimit?.points || 100,
      duration: options.rateLimit?.duration || 60,
      blockDuration: options.rateLimit?.blockDuration || 60
    })
  }

  public async createEventStream(clientId: string, user: JwtType): Promise<Observable<MessageEvent>> {
    try {
      await this.rateLimiter.consume(user.userId)

      const client: SSEClient = {
        id: clientId,
        userId: user.userId,
        roles: user.roles,
        channels: new Set(),
        connectionTime: Date.now(),
        reconnectAttempts: 0
      }

      this.clients.set(clientId, client)
      this.logger.log(`Client connected: ${clientId} (User: ${user.userId})`)

      return this.eventSubject.pipe(
        filter((event) => {
          if ("targetUserId" in event) {
            return event.targetUserId === user.userId
          }
          return true
        }),
        map((event) => ({
          data: this.formatEventData(event),
          id: event.id || Date.now().toString(),
          type: event.type,
          retry: this.options.reconnectTimeout || 5000
        }))
      )
    } catch (error) {
      if (error instanceof RateLimiterRes) {
        throw new HttpException(
          {
            error: "Too Many Requests",
            message: "Please try again later",
            retryAfter: Math.floor(error.msBeforeNext / 1000)
          },
          HttpStatus.TOO_MANY_REQUESTS
        )
      }
      throw error
    }
  }

  protected broadcast(event: T, channel?: string): void {
    this.eventSubject.next(event)
  }

  protected handleDisconnection(clientId: string): void {
    const client = this.clients.get(clientId)

    if (client) {
      this.logger.log(`Client disconnected: ${clientId}`)
      this.clients.delete(clientId)
    }
  }

  protected abstract validateEventType(event: T): boolean
  protected abstract formatEventData(event: T): string
}

export default BaseSSE
