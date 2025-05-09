import { HttpServer, HttpStatus, INestApplication } from "@nestjs/common"
import { Test, TestingModule } from "@nestjs/testing"
import { EventSource } from "eventsource"
import { it } from "node:test"
import { AppModule } from "src/app.module"
import EventSSEService from "src/application/services/sse/event/event-sse.service"
import JwtAuthGuard from "src/common/guards/jwt.guard"
import MockJwtAuthGuard from "test/mock/mock-jwt.guard"
import { afterAll, beforeAll, describe } from "vitest"
import * as request from "supertest"

describe("Event SSE E2E Tests", () => {
  let server: INestApplication
  let eventSseService: EventSSEService
  let eventSource: EventSource
  const url = "https://localhost/api/sse/"

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

  describe("GET /sse/event", () => {
    it("should connect to SSE endpoint successfully", async () => {
      await request(server.getHttpServer())
        .get("/sse/events")
        .expect(HttpStatus.OK)
        .expect("content-type", /text\/event-stream/)
        .expect("cache-control", "no-cache")
        .expect("connection", "keep-alive")
    })
  })
})