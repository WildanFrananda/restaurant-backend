import type Booking from "src/domain/entities/booking.entity"
import type AdminBookingService from "src/application/services/admin/booking/admin-booking.service"
import type FilterBookingDTO from "src/application/dtos/booking/filter-booking.dto"
import type UpdateBookingStatusDTO from "src/application/dtos/booking/update-booking-status.dto"
import type AssignChefDTO from "src/application/dtos/chef/assign-chef.dto"
import { Body, Controller, Get, Param, Put, Query } from "@nestjs/common"
import Admin from "src/common/decorators/admin.decorator"

@Admin()
@Controller("admin/booking")
class AdminBookingController {
  constructor(private readonly adminBookingService: AdminBookingService) {}

  @Get()
  public async getBookings(@Query() dto: FilterBookingDTO): Promise<Booking[] | null> {
    return await this.adminBookingService.getBookings(dto)
  }

  @Put(":id/status")
  public async updateBookingStatus(
    @Param("id") id: string,
    @Body() dto: UpdateBookingStatusDTO
  ): Promise<Booking> {
    return await this.adminBookingService.updateBookingStatus(id, dto)
  }

  @Put(":id/assign-chef")
  public async assignChef(@Param("id") id: string, @Body() dto: AssignChefDTO) {
    return await this.adminBookingService.assignChef(id, dto)
  }
}

export default AdminBookingController
