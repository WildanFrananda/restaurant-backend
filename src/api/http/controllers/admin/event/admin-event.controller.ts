import { Body, Controller, Delete, Get, Param, Post, Put } from "@nestjs/common"
import CreateEventDTO from "src/application/dtos/event/create-event.dto"
import UpdateEventDTO from "src/application/dtos/event/update-event.dto"
import EventService from "src/application/services/event/event.service"
import Admin from "src/common/decorators/admin.decorator"
import AppEvent from "src/domain/entities/event.entity"

@Admin()
@Controller("admin/event")
class AdminEventController {
  constructor(private readonly eventService: EventService) {}

  @Get()
  public async findAllEvents(): Promise<AppEvent[]> {
    return await this.eventService.findAllEvents()
  }

  @Post()
  public async createEvent(@Body() dto: CreateEventDTO): Promise<AppEvent> {
    return await this.eventService.createEvent(dto)
  }

  @Put(":id")
  public async updateEvent(@Param("id") id: string, @Body() dto: UpdateEventDTO): Promise<AppEvent> {
    return await this.eventService.updateEvent(id, dto)
  }

  @Delete(":id")
  public async deleteEvent(@Param("id") id: string): Promise<{ message: string }> {
    await this.eventService.deleteEvent(id)

    return { message: "AppEvent deleted successfully" }
  }
}

export default AdminEventController
