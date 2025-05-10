import { INestApplication } from "@nestjs/common"
import { Test, TestingModule } from "@nestjs/testing"
import { AppModule } from "src/app.module"
import EventSSEService from "src/application/services/sse/event/event-sse.service"
import JwtAuthGuard from "src/common/guards/jwt.guard"
import MockJwtAuthGuard from "test/mocks/mock-jwt-auth.guard"

type SetupTest = {
  server: INestApplication
  eventSseService: EventSSEService
  moduleFixture: TestingModule
}

async function setupTestEnvironment(): Promise<SetupTest> {
  const moduleFixture: TestingModule = await Test.createTestingModule({
    imports: [AppModule]
  })
    .overrideGuard(JwtAuthGuard)
    .useClass(MockJwtAuthGuard)
    .compile()

  const server = moduleFixture.createNestApplication()

  await server.init()

  const eventSseService = moduleFixture.get<EventSSEService>(EventSSEService)

  return {
    server,
    eventSseService,
    moduleFixture
  }
}

export default setupTestEnvironment
