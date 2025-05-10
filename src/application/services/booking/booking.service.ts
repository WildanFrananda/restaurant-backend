import type CreateBookingDTO from "src/application/dtos/booking/create-booking.dto"
import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common"
import ChefGateway from "src/api/websocket/gateways/chef/chef.gateway"
import Booking from "src/domain/entities/booking.entity"
import BookingStatus from "src/domain/enums/booking-status.enum"
import BookingType from "src/domain/enums/booking-type.enum"
import ChefLocation from "src/domain/enums/chef-location.enum"
import ChefStatus from "src/domain/enums/chef-status.enum"
import BookingRepository from "src/domain/repositories/booking.repository"
import MenuRepository from "src/domain/repositories/menu.repository"
import TableRepository from "src/domain/repositories/table.repository"
import WalletService from "../wallet/wallet.service"
import BookingMenuRepository from "src/domain/repositories/booking-menu.repository"
import GetBookingHistoryDto from "src/application/dtos/booking/get-booking-history.dto"
import BookingGateway from "src/api/websocket/gateways/booking/booking.gateway"

@Injectable()
class BookingService {
  constructor(
    private readonly chefGateway: ChefGateway,
    private readonly bookingRepository: BookingRepository,
    private readonly tableRepository: TableRepository,
    private readonly menuRepository: MenuRepository,
    private readonly bookingMenuRepository: BookingMenuRepository,
    private readonly walletService: WalletService,
    private readonly bookingGateway: BookingGateway
  ) {}

  public async createBooking(dto: CreateBookingDTO, userId: string): Promise<Booking> {
    const { type, schedule: rawSchedule, location, menuItems, tableId } = dto
    const schedule = rawSchedule ? new Date(rawSchedule) : new Date()

    if (type === BookingType.RESTAURANT) {
      if (!tableId || !menuItems || menuItems.length === 0) {
        throw new BadRequestException("tableId and menuItems are required for restaurant bookings")
      }

      const table = await this.tableRepository.findOneTable(tableId)

      if (!table) {
        throw new NotFoundException("Table not found")
      }

      let totalAmount = 0
      const menuDetails = []

      for (const item of menuItems) {
        const menu = await this.menuRepository.findOneMenuById(item.menuId)

        if (!menu) {
          throw new NotFoundException("Menu not found")
        }

        menuDetails.push({
          menu,
          quantity: item.quantity,
          priceAtBooking: Number(menu.price)
        })

        totalAmount += Number(menu.price) * item.quantity
      }

      const booking = this.bookingRepository.create(
        { id: userId },
        type,
        new Date(schedule),
        BookingStatus.CONFIRMED,
        undefined,
        table,
        menuDetails[0].menu
      )

      booking.totalAmount = totalAmount

      await this.bookingRepository.persistAndFlush(booking)

      for (const item of menuDetails) {
        const bookingMenu = this.bookingMenuRepository.createBookingMenu(
          booking,
          item.menu,
          item.quantity,
          item.priceAtBooking
        )

        await this.bookingMenuRepository.persistAndFlush(bookingMenu)
      }

      this.bookingGateway.sendBookingCreated(booking)
      this.bookingGateway.notifyUser(userId, "bookingCreated", {
        bookingId: booking.id,
        status: booking.status,
        type: booking.type,
        message: "Your restaurant booking has been confirmed!"
      })


      return booking
    } else if (type === BookingType.HOME_DINE_IN) {
      if (!menuItems || menuItems.length === 0 || !location) {
        throw new BadRequestException("menuId and location are required for home dine in bookings")
      }

      let totalAmount = 0
      const menuDetails = []

      for (const item of menuItems) {
        const menu = await this.menuRepository.findOneMenuById(item.menuId)

        if (!menu) {
          throw new NotFoundException("Menu not found")
        }

        menuDetails.push({
          menu,
          quantity: item.quantity,
          priceAtBooking: Number(menu.price)
        })

        totalAmount += Number(menu.price) * item.quantity
      }

      try {
        const tempBookingId = `temp_${userId}-${new Date().getTime()}`
        const paymentResult = await this.walletService.payment(
          userId,
          tempBookingId,
          totalAmount,
          `Pre-payment for booking: ${tempBookingId}`
        )

        const booking = this.bookingRepository.create(
          { id: userId },
          type,
          new Date(schedule),
          BookingStatus.PENDING,
          ChefLocation.SEARCHING,
          undefined,
          menuDetails[0].menu,
          location
        )

        booking.totalAmount = totalAmount

        await this.bookingRepository.persistAndFlush(booking)

        for (const item of menuDetails) {
          const bookingMenu = this.bookingMenuRepository.createBookingMenu(
            booking,
            item.menu,
            item.quantity,
            item.priceAtBooking
          )

          await this.bookingMenuRepository.persistAndFlush(bookingMenu)
        }

        await this.walletService.updateTransactionBookingId(
          paymentResult.transaction.id,
          booking.id
        )

        this.bookingGateway.sendBookingCreated(booking)
        this.bookingGateway.notifyUser(userId, "bookingCreated", {
          bookingId: booking.id,
          status: booking.status,
          type: booking.type,
          message: "Your home dine-in booking is pending, searching for a chef."
        })

        return booking
      } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : "Unknown error"
        throw new BadRequestException(`Payment failed: ${errorMessage}`)
      }
    } else {
      throw new BadRequestException("Invalid booking type")
    }
  }

  public async getBookingById(id: string): Promise<Booking> {
    const booking = await this.bookingRepository.filterBookingById(id)

    if (!booking) {
      throw new NotFoundException("Booking not found")
    }

    return booking
  }

  public async getBookingMenus(bookingId: string) {
    return await this.bookingMenuRepository.findByBookingId(bookingId)
  }

  public async getHistory(
    userId: string,
    dto: GetBookingHistoryDto
  ): Promise<{ data: Booking[]; total: number; page: number; limit: number }> {
    const { limit, page, status, type, startDate, endDate } = dto
    const conditions: Record<string, unknown> = {
      user: { id: userId }
    }

    if (status) {
      conditions.status = status
    }
    if (type) {
      conditions.type = type
    }
    if (startDate) {
      conditions.schedule = { $gte: new Date(startDate) }
    }
    if (endDate) {
      conditions.schedule = {
        ...(conditions.schedule as object),
        $lte: new Date(endDate)
      }
    }

    const [bookings, total] = await this.bookingRepository.findUserHistory(conditions, limit, page)

    return { data: bookings, total, page, limit }
  }

  public orderCompleted(userId: string, bookingId: string, chefId: string): void {
    this.chefGateway.updateChefStatus(chefId, ChefStatus.AVAILABLE)
    this.chefGateway.updateChefLocation(chefId, bookingId, ChefLocation.COMPLETED)

    this.bookingGateway.notifyUser(userId, "bookingUpdated", {
      bookingId,
      newStatus: BookingStatus.CONFIRMED,
      updatedAt: new Date().toISOString()
    })
  }
}

export default BookingService
