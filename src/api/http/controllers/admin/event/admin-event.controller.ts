import { Body, Controller, Delete, Param, Post, Put } from "@nestjs/common"
import CreateEventDTO from "src/application/dtos/event/create-event.dto"
import UpdateEventDTO from "src/application/dtos/event/update-event.dto"
import EventService from "src/application/services/event/event.service"
import Admin from "src/common/decorators/admin.decorator"
import Event from "src/domain/entities/event.entity"

@Admin()
@Controller("admin/event")
class AdminEventController {
  constructor(private readonly eventService: EventService) {}

  @Post()
  public async createEvent(@Body() dto: CreateEventDTO): Promise<Event> {
    return await this.eventService.createEvent(dto)
  }

  @Put(":id")
  public async updateEvent(@Param("id") id: string, @Body() dto: UpdateEventDTO): Promise<Event> {
    return await this.eventService.updateEvent(id, dto)
  }

  @Delete(":id")
  public async deleteEvent(@Param("id") id: string): Promise<{ message: string }> {
    await this.eventService.deleteEvent(id)

    return { message: "Event deleted successfully" }
  }
}

export default AdminEventController
