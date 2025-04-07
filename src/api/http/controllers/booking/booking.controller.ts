import type Booking from "src/domain/entities/booking.entity"
import type CreateBookingDTO from "src/application/dtos/booking/create-booking.dto"
import type OrderCompleteDTO from "src/application/dtos/booking/order-complete.dto"
import type AuthenticatedRequest from "src/common/types/user.type"
import { Body, Controller, Get, Param, Post, Req } from "@nestjs/common"
import BookingService from "src/application/services/booking/booking.service"

@Controller("booking")
class BookingController {
  constructor(private readonly bookingService: BookingService) {}

  @Post()
  public async createBooking(
    @Req() req: AuthenticatedRequest,
    @Body() dto: CreateBookingDTO
  ): Promise<Booking> {
    const userId = req.user.userId

    return await this.bookingService.createBooking(dto, userId)
  }

  @Get(":id")
  public async getBooking(@Param("id") id: string): Promise<Booking> {
    return this.bookingService.getBookingById(id)
  }

  @Post("complete")
  public orderCompleted(@Body() dto: OrderCompleteDTO): void {
    const { bookingId, chefId } = dto
    return this.bookingService.orderCompleted(bookingId, chefId)
  }
}

export default BookingController
