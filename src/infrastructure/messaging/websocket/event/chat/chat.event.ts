import JoinRoomEvent from "../join-room.event"
import LeaveRoomEvent from "../leave-room.event"
import ChatMessageEvent from "./message.event"
import ErrorEvent from "../error.event"

type ChatEvent = JoinRoomEvent | LeaveRoomEvent | ChatMessageEvent | ErrorEvent

export default ChatEvent
