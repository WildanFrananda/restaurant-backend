class WsException extends Error {
  constructor(message: string) {
    super(message)
    this.name = "WsException"
  }
}

export default WsException
