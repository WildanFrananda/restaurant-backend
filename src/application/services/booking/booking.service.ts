import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common"
import CreateBookingDTO from "src/application/dtos/booking/create-booking.dto"
import Booking from "src/domain/entities/booking.entity"
import BookingStatus from "src/domain/enums/booking-status.enum"
import BookingType from "src/domain/enums/booking-type.enum"
import BookingRepository from "src/domain/repositories/booking.repository"
import MenuRepository from "src/domain/repositories/menu.repository"
import TableRepository from "src/domain/repositories/table.repository"

@Injectable()
class BookingService {
  constructor(
    private readonly bookingRepository: BookingRepository,
    private readonly tableRepository: TableRepository,
    private readonly menuRepository: MenuRepository
  ) {}

  public async createBooking(dto: CreateBookingDTO, userId: string): Promise<Booking> {
    const { type, schedule, location, menuId, tableId } = dto

    if (type === BookingType.RESTAURANT) {
      if (!tableId) {
        throw new BadRequestException("tableId is required for restaurant bookings")
      }

      const table = await this.tableRepository.findOneTable(tableId)

      if (!table) {
        throw new NotFoundException("Table not found")
      }

      const booking = this.bookingRepository.create(
        { id: userId },
        type,
        new Date(schedule),
        BookingStatus.PENDING,
        table
      )

      await this.bookingRepository.persistAndFlush(booking)

      return booking
    } else if (type === BookingType.HOME_DINE_IN) {
      if (!menuId || location) {
        throw new BadRequestException("menuId and location are required for home dine in bookings")
      }

      const menu = await this.menuRepository.findOneMenuById(menuId)

      if (!menu) {
        throw new NotFoundException("Menu not found")
      }

      const booking = this.bookingRepository.create(
        { id: userId },
        type,
        new Date(schedule),
        BookingStatus.PENDING,
        undefined,
        menu,
        location
      )

      await this.bookingRepository.persistAndFlush(booking)

      return booking
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
}

export default BookingService
