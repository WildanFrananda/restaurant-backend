import { EventSource } from "eventsource"

class MockSSEClient {
  private eventSource: EventSource
  private messageHandlers: ((event: MessageEvent) => void)[] = []
  private errorHandlers: ((error: unknown) => void)[] = []

  constructor(url: string) {
    this.eventSource = new EventSource(url)

    this.eventSource.onmessage = (event) => {
      this.messageHandlers.forEach((handler) => handler(event))
    }

    this.eventSource.onerror = (error) => {
      this.errorHandlers.forEach((handler) => handler(error))
    }
  }

  public onMessage(handler: (event: MessageEvent) => void): void {
    this.messageHandlers.push(handler)
  }

  public onError(handler: (error: unknown) => void): void {
    this.errorHandlers.push(handler)
  }

  public close(): void {
    this.eventSource.close()
  }
}

export default MockSSEClient
