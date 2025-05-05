import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common"
import WalletGateway from "src/api/websocket/gateways/wallet/wallet.gateway"
import AdminBookingNotification from "src/common/types/admin-booking.type"
import BookingStatus from "src/domain/enums/booking-status.enum"
import BookingType from "src/domain/enums/booking-type.enum"
import TransactionFailureReason from "src/domain/enums/transaction-failure-reason.enum"
import TransactionStatus from "src/domain/enums/transaction-status.enum"
import TransactionType from "src/domain/enums/transaction-type.enum"
import BookingRepository from "src/domain/repositories/booking.repository"
import TransactionRepository from "src/domain/repositories/transaction.repository"
import UserRepository from "src/domain/repositories/user.repository"
import WalletUpdateEvent from "src/infrastructure/messaging/websocket/event/wallet/wallet-update.event"
import AdminWalletSSEService from "../sse/wallet/admin-wallet-sse.service"
import WalletSSEService from "../sse/wallet/wallet-sse.service"

@Injectable()
class WalletService {
  constructor(
    private readonly transactionRepository: TransactionRepository,
    private readonly userRepository: UserRepository,
    private readonly bookingRepository: BookingRepository,
    private readonly walletGateway: WalletGateway,
    private readonly walletSSEService: WalletSSEService,
    private readonly adminWalletSSEService: AdminWalletSSEService
  ) {}

  public async deposit(
    userId: string,
    amount: number,
    notes?: string
  ): Promise<{ message: string }> {
    if (amount < 10000) {
      throw new BadRequestException("Minimum deposit 10.000")
    }

    const profile = await this.userRepository.findUserProfileByUserId(userId)

    if (!profile) {
      throw new NotFoundException("User not found")
    }

    profile.walletBallance = Number(profile.walletBallance) + amount
    await this.userRepository.persistAndFlush(profile)

    const transaction = this.transactionRepository.createTransaction(
      profile.user,
      amount,
      TransactionType.TOP_UP,
      TransactionStatus.SUCCESS,
      undefined,
      undefined,
      notes
    )

    await this.transactionRepository.persistAndFlush(transaction)

    const payload: WalletUpdateEvent = {
      type: "walletUpdated",
      data: {
        userId: userId,
        newBalance: Number(profile.walletBallance),
        amountChanged: amount,
        transactionType: TransactionType.TOP_UP,
        updatedAt: new Date().toISOString()
      }
    }

    this.walletGateway.notifyWalletUpdate(payload)
    this.walletSSEService.notifyWalletUpdate(payload)

    return { message: "Deposit successful" }
  }

  public async payment(
    userId: string,
    bookingId: string,
    amount: number,
    notes?: string
  ): Promise<{
    message: string
    transaction: { id: string; amount: number; status: TransactionStatus }
  }> {
    const profile = await this.userRepository.findUserProfileByUserId(userId)

    if (!profile) {
      throw new NotFoundException("User not found")
    }

    let booking = null

    if (!bookingId.startsWith("temp_")) {
      booking = await this.bookingRepository.filterBookingById(bookingId)

      if (!booking) {
        throw new NotFoundException("Booking not found")
      }
    }

    if (Number(profile.walletBallance) < amount) {
      if (booking) {
        const failedTransaction = this.transactionRepository.createTransaction(
          profile.user,
          amount,
          TransactionType.PAYMENT,
          TransactionStatus.FAILED,
          TransactionFailureReason.INSUFFICIENT_BALANCE,
          booking,
          notes
        )

        await this.transactionRepository.persistAndFlush(failedTransaction)
      }
      throw new BadRequestException("Insufficient funds for this transaction")
    }

    profile.walletBallance = Number(profile.walletBallance) - amount

    await this.transactionRepository.persistAndFlush(profile)

    const transaction = this.transactionRepository.createTransaction(
      profile.user,
      amount,
      TransactionType.PAYMENT,
      TransactionStatus.SUCCESS,
      undefined,
      booking,
      notes
    )

    await this.transactionRepository.persistAndFlush(transaction)

    const payload: WalletUpdateEvent = {
      type: "walletUpdated",
      data: {
        userId: userId,
        newBalance: Number(profile.walletBallance),
        amountChanged: -amount,
        transactionType: TransactionType.PAYMENT,
        updatedAt: new Date().toISOString()
      }
    }

    this.walletGateway.notifyWalletUpdate(payload)
    this.walletSSEService.notifyWalletUpdate(payload)

    if (
      booking &&
      booking.type === BookingType.HOME_DINE_IN &&
      booking.status === BookingStatus.PENDING
    ) {
      const adminPayload: AdminBookingNotification = {
        type: "adminBookingNotification",
        data: {
          bookingId: booking.id,
          message: "New bookings require chef selection!",
          schedule: booking.schedule.toISOString(),
          createdAt: new Date().toISOString()
        }
      }

      this.adminWalletSSEService.notifyAdminsOfWalletUpdate(adminPayload)
    }

    return {
      message: "Payment successful",
      transaction: {
        id: transaction.id,
        amount: transaction.amount,
        status: transaction.status
      }
    }
  }

  public async updateTransactionBookingId(
    transactionId: string,
    bookingId: string
  ): Promise<void> {
    const transaction = await this.transactionRepository.findTransactionById(transactionId)

    if (!transaction) {
      throw new NotFoundException("Transaction not found")
    }

    const booking = await this.bookingRepository.findBookingById(bookingId)

    if (!booking) {
      throw new NotFoundException("Booking not found")
    }

    transaction.booking = booking

    await this.transactionRepository.persistAndFlush(transaction)
  }
}

export default WalletService
