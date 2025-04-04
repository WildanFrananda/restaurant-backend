import { Body, Controller, Get, Param, Post, Req } from "@nestjs/common"
import CreateBookingDTO from "src/application/dtos/booking/create-booking.dto"
import BookingService from "src/application/services/booking/booking.service"
import AuthenticatedRequest from "src/common/types/user.type"
import Booking from "src/domain/entities/booking.entity"

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
}

export default BookingController
