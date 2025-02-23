import type TransactionType from "src/domain/enums/transaction-type.enum"
import BaseEvent from "src/infrastructure/messaging/websocket/event/base.event"

interface WalletUpdateEvent extends BaseEvent {
  type: "walletUpdated"
  data: {
    userId: string
    newBalance: number
    amountChanged: number
    transactionType: TransactionType
    updatedAt: string
  }
  timestamp?: number
  targetUserId?: string
}

export default WalletUpdateEvent
