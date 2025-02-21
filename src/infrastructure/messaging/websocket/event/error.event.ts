import BaseEvent from "./base.event"

interface ErrorEvent extends BaseEvent {
  type: "error"
  data: {
    message: string
    code?: number
  }
}

export default ErrorEvent
