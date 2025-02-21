import BaseEvent from "../base.event"

interface ChatMessageEvent extends BaseEvent {
  type: "message"
  data: {
    content: string
    room?: string
  }
}

export default ChatMessageEvent
