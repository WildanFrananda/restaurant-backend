import BaseEvent from "./base.event"

interface LeaveRoomEvent extends BaseEvent {
  type: "leave"
  data: {
    room: string
  }
}

export default LeaveRoomEvent
