import BaseEvent from "./base.event"

interface JoinRoomEvent extends BaseEvent {
  type: "join"
  data: {
    room: string
  }
}

export default JoinRoomEvent
