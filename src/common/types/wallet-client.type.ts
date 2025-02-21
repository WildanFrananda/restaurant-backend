import { WebSocket } from "ws"

interface WalletClient extends WebSocket {
  id: string
}

export default WalletClient
