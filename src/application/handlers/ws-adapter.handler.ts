import { Injectable } from "@nestjs/common"

type AckCallback = (data: unknown) => void

@Injectable()
class WsAdapterHandler {
  private readonly ackCallbacks: Map<string, AckCallback> = new Map()
  private ackCounter = 0

  public createAcknowledgement(callback: AckCallback): string {
    const ackId = `ack_${++this.ackCounter}`

    this.ackCallbacks.set(ackId, callback)

    return ackId
  }

  public handleAcknowledgement(ackId: string, data: unknown): void {
    const callback = this.ackCallbacks.get(ackId)

    if (callback) {
      callback(data)
      this.ackCallbacks.delete(ackId)
    }
  }
}

export default WsAdapterHandler
