import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common"
import WalletGateway from "src/api/websocket/gateways/wallet/wallet.gateway"
import TransactionFailureReason from "src/domain/enums/transaction-failure-reason.enum"
import TransactionStatus from "src/domain/enums/transaction-status.enum"
import TransactionType from "src/domain/enums/transaction-type.enum"
import BookingRepository from "src/domain/repositories/booking.repository"
import TransactionRepository from "src/domain/repositories/transaction.repository"
import UserRepository from "src/domain/repositories/user.repository"
import SseService from "../sse/sse.service"
import WalletUpdateEvent from "src/infrastructure/messaging/websocket/event/wallet/wallet-update.event"
import AdminBookingNotification from "src/common/types/admin-booking.type"

@Injectable()
class WalletService {
  constructor(
    private readonly transactionRepository: TransactionRepository,
    private readonly userRepository: UserRepository,
    private readonly bookingRepository: BookingRepository,
    private readonly walletGateway: WalletGateway,
    private readonly sseService: SseService
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

    const transaction = await this.transactionRepository.createTransaction(
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
    this.sseService.notifyWalletUpdate(payload)

    return { message: "Deposit successful" }
  }

  public async payment(
    userId: string,
    bookingId: string,
    amount: number
  ): Promise<{ message: string }> {
    const profile = await this.userRepository.findUserProfileByUserId(userId)

    if (!profile) {
      throw new NotFoundException("User not found")
    }

    const booking = await this.bookingRepository.findBookingId(bookingId)

    if (!booking) {
      throw new NotFoundException("Booking not found")
    }

    if (Number(profile.walletBallance) < amount) {
      const failedTransaction = await this.transactionRepository.createTransaction(
        profile.user,
        amount,
        TransactionType.PAYMENT,
        TransactionStatus.FAILED,
        TransactionFailureReason.INSUFFICIENT_BALANCE,
        booking
      )

      await this.transactionRepository.persistAndFlush(failedTransaction)

      throw new BadRequestException("Insufficient funds for this transaction")
    }

    profile.walletBallance = Number(profile.walletBallance) - amount

    await this.transactionRepository.persistAndFlush(profile)

    const transaction = await this.transactionRepository.createTransaction(
      profile.user,
      amount,
      TransactionType.PAYMENT,
      TransactionStatus.SUCCESS,
      undefined,
      booking
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
    this.sseService.notifyWalletUpdate(payload)

    if (booking.type === "home dine in" && booking.status === "confirmed") {
      const adminPayload: AdminBookingNotification = {
        event: "adminBookingNotification",
        bookingId: booking.id,
        message: "New bookings require chef selection",
        schedule: booking.schedule.toISOString(),
        createdAt: new Date().toISOString()
      }
      this.sseService.notifyAdminBooking(adminPayload)
    }

    return { message: "Payment successful" }
  }
}

export default WalletService
