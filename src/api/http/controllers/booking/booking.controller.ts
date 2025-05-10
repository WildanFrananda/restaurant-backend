import type Booking from "src/domain/entities/booking.entity"
import type BookingMenu from "src/domain/entities/booking-menu.entity"
import type CreateBookingDTO from "src/application/dtos/booking/create-booking.dto"
import type OrderCompleteDTO from "src/application/dtos/booking/order-complete.dto"
import type AuthenticatedRequest from "src/common/types/user.type"
import { Body, Controller, Get, Param, Post, Query, Req } from "@nestjs/common"
import BookingService from "src/application/services/booking/booking.service"
import GetBookingHistoryDto from "src/application/dtos/booking/get-booking-history.dto"

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

  @Get(":id/menus")
  public async getBookingMenus(@Param("id") id: string): Promise<BookingMenu[] | null> {
    return this.bookingService.getBookingMenus(id)
  }

  @Post("complete")
  public orderCompleted(@Body() dto: OrderCompleteDTO): void {
    const { userId, bookingId, chefId } = dto
    return this.bookingService.orderCompleted(userId, bookingId, chefId)
  }

  @Get()
  async getHistory(@Req() req: AuthenticatedRequest, @Query() query: GetBookingHistoryDto) {
    const userId = req.user.userId
    return this.bookingService.getHistory(userId, query)
  }
}

export default BookingController
