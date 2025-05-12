import { HttpServer, HttpStatus, INestApplication } from "@nestjs/common"
import { vi } from "vitest"
import MockEventSource from "test/mocks/mock-event-source"

vi.mock("eventsource", () => ({ default: MockEventSource }))

import { afterAll, beforeAll, describe, expect, it } from "vitest"
import { Test, TestingModule } from "@nestjs/testing"
import { EventSource } from "eventsource"
import { AppModule } from "src/app.module"
import { App } from "supertest/types"
import * as request from "supertest"
import EventSSEService from "src/application/services/sse/event/event-sse.service"
import JwtAuthGuard from "src/common/guards/jwt.guard"
import MockJwtAuthGuard from "test/mocks/mock-jwt.guard"
import NotificationEvent from "src/infrastructure/messaging/sse/event/notification/notification.event"
import { config as dotenvConfig } from "dotenv"

dotenvConfig()

describe("Event SSE E2E Tests", () => {
  let server: INestApplication
  let eventSseService: EventSSEService
  let eventSource: EventSource
  const url = "https://localhost/api/sse/events"

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule]
    })
      .overrideGuard(JwtAuthGuard)
      .useClass(MockJwtAuthGuard)
      .compile()

    server = moduleFixture.createNestApplication()
    await server.init()

    const httpServer: HttpServer = server.getHttpServer()
    await new Promise<void>((resolve: () => void): void => {
      httpServer.listen(0, () => resolve())
    })

    eventSseService = moduleFixture.get<EventSSEService>(EventSSEService)
  })

  afterAll(async () => {
    if (eventSource) {
      eventSource.close()
    }

    await server.close()
  })

  describe("GET /sse/events", () => {
    it("should connect to SSE endpoint successfully", async () => {
      await request(server.getHttpServer() as App)
        .get("/sse/events")
        .expect(HttpStatus.OK)
        .expect("content-type", /text\/event-stream/)
        .expect("cache-control", "no-cache")
        .expect("connection", "keep-alive")
        .catch((error: Error) => {
          throw new Error(`Request failed: ${error.message}`)
        })
    })

    it("should receive SSE events", { timeout: 10000 }, () => {
      return new Promise<void>((done) => {
        const events: NotificationEvent[] = []
        const expectedEvents = 3

        eventSource = new EventSource(url)
        eventSource.onmessage = (event) => {
          const parsedData: NotificationEvent = JSON.parse(event.data as string)
          events.push(parsedData)

          if (events.length === expectedEvents) {
            eventSource.close()

            expect(events.length).toBe(expectedEvents)
            expect(events[0].data.id).toBe("promo-123")
            expect(events[1].data.id).toBe("event-456")
            expect(events[2].data.id).toBe("popup-123")

            done()
          }
        }

        eventSource.onerror = (error) => {
          eventSource.close()
          done()
          throw new Error(`SSE connection error: ${JSON.stringify(error)}`)
        }

        setTimeout(() => {
          eventSseService.notifyEvent({
            type: "newPromo",
            data: {
              id: "promo-123",
              name: "Special Promo",
              description: "Limited time offer"
            }
          })

          eventSseService.notifyEvent({
            type: "eventUpdated",
            data: {
              id: "event-456",
              name: "Updated Event",
              description: "Event details updated"
            }
          })

          eventSseService.notifyEvent({
            type: "eventPopup",
            data: {
              id: "popup-789",
              name: "New Popup",
              description: "Check this out!",
              imageUrl: "https://example.com/image.jpg"
            }
          })
        }, 100)
      })
    })

    it("should filter events by targetUserId", { timeout: 10000 }, () => {
      return new Promise<void>((done) => {
        const events: NotificationEvent[] = []

        eventSource = new EventSource(url)
        eventSource.onmessage = (event) => {
          const parsedData: NotificationEvent = JSON.parse(event.data as string)
          events.push(parsedData)

          eventSource.close()
          expect(events.length).toBe(1)
          expect(events[0].data.id).toBe("targeted-event")
          done()
        }

        eventSource.onerror = (error) => {
          eventSource.close()
          done()
          throw new Error(`SSE connection error: ${JSON.stringify(error)}`)
        }

        setTimeout(() => {
          eventSseService.notifyEvent({
            type: "newPromo",
            data: {
              id: "other-user-promo",
              name: "Other User Promo",
              description: "Not for current user"
            },
            targetUserId: "other-user-id"
          })

          eventSseService.notifyEvent({
            type: "eventUpdated",
            data: {
              id: "targeted-event",
              name: "Your Event",
              description: "This is for you!"
            },
            targetUserId: "test-user-id"
          })
        }, 100)
      })
    })

    it("should reject connections that exceed rate limit", async () => {
      vi.spyOn(eventSseService["rateLimiter"], "consume").mockImplementation(() => {
        throw new Error(
          JSON.stringify({
            msBeforeNext: 5000,
            remainingPoints: 0
          })
        )
      })

      const response = await request(server.getHttpServer() as App)
        .get("/sse/events")
        .expect(HttpStatus.TOO_MANY_REQUESTS)

      expect(response.body).toHaveProperty("error", "Too Many Requests")
      expect(response.body).toHaveProperty("message", "Please try again later")
      expect(response.body).toHaveProperty("retryAfter", 5)

      vi.restoreAllMocks()
    })

    it("should ignore invalid event types", { timeout: 1000 }, () => {
      return new Promise<void>((done) => {
        const events: NotificationEvent[] = []

        eventSource = new EventSource(url)

        let validEventReceived = false

        eventSource.onmessage = (event) => {
          const parsedData: NotificationEvent = JSON.parse(event.data as string)

          events.push(parsedData)

          validEventReceived = true

          eventSource.close()
          expect(parsedData.data.id).toBe("valid-event")
          done()
        }

        eventSource.onerror = (error) => {
          eventSource.close()
          done()
          throw new Error(`EventSource failed: ${JSON.stringify(error)}`)
        }

        setTimeout(() => {
          if (!validEventReceived) {
            eventSource.close()
            expect(events.length).toBe(0)
            done()
          }
        }, 1000)

        const invalidEvent = {
          type: "invalidType",
          data: {
            id: "invalid-event",
            name: "Invalid Event",
            description: "This should be ignored"
          },
          timestamp: Date.now()
        }

        setTimeout(() => {
          const spy = vi.spyOn(eventSseService, "notifyEvent")
          spy.mockRejectedValueOnce(false)

          eventSseService["eventSubject"].next(invalidEvent as NotificationEvent)

          eventSseService.notifyEvent({
            type: "newPromo",
            data: {
              id: "valid-event",
              name: "Valid Event",
              description: "This should be received"
            }
          })

          spy.mockRestore()
        }, 100)
      })
    })
  })

  describe("Client Disconnection Handling", () => {
    it("should handle client disconnection properly", { timeout: 10000 }, () => {
      return new Promise<void>((done) => {
        const disconnectSpy = vi.spyOn(eventSseService, "handleDisconnection")
        let clientId: string

        eventSource = new EventSource(url)

        setTimeout(() => {
          const clients = Array.from(eventSseService.getClients().entries())

          if (clients.length > 0) {
            clientId = clients[0][0]

            eventSource.close()

            eventSseService.handleDisconnection(clientId)

            expect(disconnectSpy).toHaveBeenCalledWith(clientId)
            expect(eventSseService.getClients().has(clientId)).toBe(false)
            disconnectSpy.mockRestore()
            done()
          } else {
            eventSource.close()
            done()
            throw new Error("No clients connected")
          }
        }, 500)
      })
    })
  })
})
