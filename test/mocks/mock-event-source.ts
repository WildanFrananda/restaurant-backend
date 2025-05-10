import { EventEmitter } from "events"

class MockEventSource extends EventEmitter {
  public url: string
  public readyState: number

  constructor(url: string) {
    super()
    this.url = url
    this.readyState = 0

    setTimeout(() => {
      this.readyState = 1
      this.emit("open")
    }, 50)
  }

  public close(): void {
    this.readyState = 2
    this.emit("close")
  }
}

export default MockEventSource
