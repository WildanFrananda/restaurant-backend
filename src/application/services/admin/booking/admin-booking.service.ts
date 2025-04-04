import type Booking from "src/domain/entities/booking.entity"
import type BookingRepository from "src/domain/repositories/booking.repository"
import type FilterBookingDTO from "src/application/dtos/booking/filter-booking.dto"
import type UpdateBookingStatusDTO from "src/application/dtos/booking/update-booking-status.dto"
import { Injectable, NotFoundException } from "@nestjs/common"
import AssignChefDTO from "src/application/dtos/chef/assign-chef.dto"
import ChefRepository from "src/domain/repositories/chef.repository"

@Injectable()
class AdminBookingService {
  constructor(
    private readonly bookingRepository: BookingRepository,
    private readonly chefRepository: ChefRepository
  ) {}

  public async getBookings(dto: FilterBookingDTO): Promise<Booking[] | null> {
    const { status, type, chefAssigned } = dto
    const conditions: Record<string, unknown> = {}

    if (status) {
      conditions.status = status
    }

    if (type) {
      conditions.type = type
    }

    if (chefAssigned === "false") {
      conditions.chef = null
    }

    return await this.bookingRepository.filterBookingByConditions(conditions)
  }

  public async updateBookingStatus(id: string, dto: UpdateBookingStatusDTO): Promise<Booking> {
    const { status } = dto
    const booking = await this.bookingRepository.filterBookingById(id)

    if (!booking) {
      throw new NotFoundException("Booking not found")
    }

    booking.status = status

    await this.bookingRepository.persistAndFlush(booking)

    return booking
  }

  public async assignChef(id: string, dto: AssignChefDTO) {
    const { chefId } = dto
    const booking = await this.bookingRepository.findBookingById(id)

    if (!booking) {
      throw new NotFoundException("Booking not found")
    }

    const chef = await this.chefRepository.findOneChef(chefId)

    if (!chef) {
      throw new NotFoundException("Chef not found")
    }

    booking.chef = chef

    await this.bookingRepository.persistAndFlush(booking)

    return booking
  }
}

export default AdminBookingService
