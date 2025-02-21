import { WebSocket } from "ws"

interface WebSocketClient extends WebSocket {
  id: string
  rooms: Set<string>
  data: Map<string, unknown>
}

export default WebSocketClient
