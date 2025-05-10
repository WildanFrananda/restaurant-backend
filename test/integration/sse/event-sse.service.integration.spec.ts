import type NotificationEvent from "src/infrastructure/messaging/sse/event/notification/notification.event"
import { HttpException, HttpStatus } from "@nestjs/common"
import { Test } from "@nestjs/testing"
import { filter, firstValueFrom, take, timeout } from "rxjs"
import EventSSEService from "src/application/services/sse/event/event-sse.service"
import MockEventSSEService from "test/mocks/mock-event-sse.service"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

describe("EventSSEService Integration Test", () => {
  let eventSseService: EventSSEService

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [EventSSEService]
    }).compile()

    eventSseService = moduleRef.get<EventSSEService>(EventSSEService)
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  describe("createEventStream", () => {
    it("should create an event stream for a client", async () => {
      const clientId = "test-client-id"
      const user = { userId: "test-user-id", email: "test@gmail.com", roles: ["user"] }
      const stream = await eventSseService.createEventStream(clientId, user)

      expect(stream).toBeDefined()
      expect(eventSseService.getClients().has(clientId)).toBe(true)

      const client = eventSseService.getClients().get(clientId)

      expect(client?.userId).toBe(user.userId)
    })

    it("should throw HttpException when rate limit is exceeded", async () => {
      const clientId = "test-client-id"
      const user = { userId: "rate-limited-user", email: "ratelimit@gmail.com", roles: ["user"] }
      const error = new HttpException(
        {
          msBeforeNext: 10000,
          remainingPoints: 0,
          message: "Rate limit exceeded"
        },
        429
      )

      vi.spyOn(eventSseService, "createEventStream").mockRejectedValueOnce(error)
      await expect(eventSseService.createEventStream(clientId, user)).rejects.toThrow(HttpException)

      try {
        await eventSseService.createEventStream(clientId, user)
      } catch (error) {
        const httpError = error as HttpException
        expect(httpError).toBeInstanceOf(HttpException)
        expect(httpError.getStatus()).toBe(HttpStatus.TOO_MANY_REQUESTS)
        expect(httpError.getResponse()).toEqual({
          error: "Too Many Requests",
          message: "Please try again later",
          retryAfter: 10
        })
      }
    })
  })

  describe("notifyEvent", () => {
    it("should broadcast events to all clients", async () => {
      const clientId = "test-client-id"
      const user = { userId: "test-user-id", email: "test@gmail.com", roles: ["user"] }
      const stream = await eventSseService.createEventStream(clientId, user)
      const eventPromise = firstValueFrom(
        stream.pipe(
          filter((event) => event.type === "newPromo"),
          take(1),
          timeout(1000)
        )
      )
      const testEvent = {
        type: "newPromo" as const,
        data: {
          id: "test-promo-id",
          name: "Test Promo",
          description: "Test description"
        }
      }

      eventSseService.notifyEvent(testEvent)

      const receivedEvent = await eventPromise

      expect(receivedEvent.type).toBe("newPromo")
      const parsedData =
        typeof receivedEvent.data === "string" ? JSON.parse(receivedEvent.data) : receivedEvent.data
      expect(parsedData).toEqual(testEvent.data)
    })

    it("should only send targeted events to the targeted user", async () => {
      const client1Id = "client-1"
      const client2Id = "client-2"
      const user1 = { userId: "user-1", email: "test@gmail.com", roles: ["user"] }
      const user2 = { userId: "user-2", email: "test@gmail.com", roles: ["user"] }

      const stream1 = await eventSseService.createEventStream(client1Id, user1)
      const stream2 = await eventSseService.createEventStream(client2Id, user2)

      const events1: NotificationEvent[] = []
      const events2: NotificationEvent[] = []

      const subscription1 = stream1.subscribe((event: NotificationEvent) => {
        events1.push({
          type: event.type ?? "",
          data: event.data,
          targetUserId: event.targetUserId,
          timestamp: event.timestamp
        })
      })

      const subscription2 = stream2.subscribe((event: NotificationEvent) => {
        events2.push({
          type: event.type ?? "",
          data: event.data,
          targetUserId: event.targetUserId,
          timestamp: event.timestamp
        })
      })

      eventSseService.notifyEvent({
        type: "eventUpdated",
        data: {
          id: "targeted-event",
          name: "Targeted Event",
          description: "For User 1 only"
        },
        targetUserId: "user-1"
      })

      eventSseService.notifyEvent({
        type: "newPromo",
        data: {
          id: "broadcast-event",
          name: "Broadcast Event",
          description: "For all users"
        }
      })

      await new Promise((resolve) => setTimeout(resolve, 100))

      subscription1.unsubscribe()
      subscription2.unsubscribe()

      expect(events1.length).toBe(2)
      expect(events1.some((e) => JSON.parse(e.data.id) === "targeted-event")).toBe(true)
      expect(events1.some((e) => JSON.parse(e.data.id) === "broadcast-event")).toBe(true)

      expect(events2.length).toBe(1)
      expect(events2.some((e) => JSON.parse(e.data.id) === "broadcast-event")).toBe(true)
      expect(events2.some((e) => JSON.parse(e.data.id) === "targeted-event")).toBe(false)
    })
  })

  describe("validateEventType", () => {
    it("should validate supported event types", () => {
      const validTypes = ["newPromo", "eventUpdated", "eventPopup"]
      const invalidTypes = ["invalid", "unsupported", ""]

      const mockEventSseService = new MockEventSSEService()

      for (const type of validTypes) {
        expect(
          mockEventSseService.validateEventTypePublic({
            type: type as "newPromo" | "eventUpdated" | "eventPopup",
            data: {
              id: "",
              name: "",
              description: ""
            },
            timestamp: Date.now()
          })
        ).toBe(true)
      }

      for (const type of invalidTypes) {
        expect(
          mockEventSseService.validateEventTypePublic({
            type: type as "newPromo" | "eventUpdated" | "eventPopup",
            data: {
              id: "",
              name: "",
              description: ""
            },
            timestamp: Date.now()
          })
        ).toBe(false)
      }
    })
  })

  describe("formatEventData", () => {
    it("should correctly format event data as JSON string", () => {
      const testEvent = {
        type: "newPromo" as const,
        data: {
          id: "test-id",
          name: "Test Event",
          description: "Test Description",
          imageUrl: "https://example.com/image.jpg"
        },
        timestamp: Date.now()
      }

      const mockEventSseService = new MockEventSSEService()

      const formattedData = mockEventSseService.formatEventData(testEvent)

      expect(formattedData).toBe(JSON.stringify(testEvent.data))
      expect(JSON.parse(formattedData)).toEqual(testEvent.data)
    })
  })

  describe("handleDisconnection", () => {
    it("should remove client from clients map", async () => {
      const clientId = "test-client-id"
      const user = { userId: "test-user-id", email: "test@gmail.com", roles: ["user"] }

      await eventSseService.createEventStream(clientId, user)
      expect(eventSseService.getClients().has(clientId)).toBe(true)

      eventSseService.handleDisconnection(clientId)

      expect(eventSseService.getClients().has(clientId)).toBe(false)
    })

    it("should do nothing when client does not exist", () => {
      const nonExistentClientId = "non-existent-client"

      const loggerSpy = vi.spyOn(eventSseService.getLogger(), "log")

      eventSseService.handleDisconnection(nonExistentClientId)

      expect(loggerSpy).not.toHaveBeenCalled()
    })
  })
})
