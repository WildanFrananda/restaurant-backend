import MockEventSource from "test/mocks/mock-event-source"
import { vi } from "vitest"

vi.mock("eventsource", () => ({ default: MockEventSource }))
