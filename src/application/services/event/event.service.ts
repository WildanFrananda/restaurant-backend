import { Injectable, NotFoundException } from "@nestjs/common"
import EventRepository from "src/domain/repositories/event.repository"
import EventSSEService from "../sse/event/event-sse.service"
import CreateEventDTO from "src/application/dtos/event/create-event.dto"
import AppEvent from "src/domain/entities/event.entity"
import UpdateEventDTO from "src/application/dtos/event/update-event.dto"

@Injectable()
class EventService {
  constructor(
    private readonly eventRepository: EventRepository,
    private readonly eventSseService: EventSSEService
  ) {}

  public async createEvent(dto: CreateEventDTO): Promise<AppEvent> {
    const { name, description, isPopup, imageUrl } = dto
    const event = this.eventRepository.createEvent(name, description, isPopup, imageUrl)

    await this.eventRepository.persistAndFlush(event)

    this.eventSseService.notifyEvent({
      type: dto.isPopup ? "eventPopup" : "newPromo",
      data: {
        id: event.id,
        name: event.name,
        description: event.description,
        imageUrl: event.imageUrl
      }
    })

    return event
  }

  public async updateEvent(id: string, dto: UpdateEventDTO): Promise<AppEvent> {
    const event = await this.eventRepository.findOneEvent(id)

    if (!event) {
      throw new NotFoundException("AppEvent not found")
    }

    if (dto.name !== undefined) {
      event.name = dto.name
    }

    if (dto.description !== undefined) {
      event.description = dto.description
    }

    if (dto.isPopup !== undefined) {
      event.isPopup = dto.isPopup
    }

    if (dto.imageUrl !== undefined) {
      event.imageUrl = dto.imageUrl
    }

    await this.eventRepository.persistAndFlush(event)

    this.eventSseService.notifyEvent({
      type: "eventUpdated",
      data: {
        id: event.id,
        name: event.name,
        description: event.description,
        imageUrl: event.imageUrl
      }
    })

    return event
  }

  public async deleteEvent(id: string): Promise<void> {
    const event = await this.eventRepository.findOneEvent(id)

    if (!event) {
      throw new NotFoundException("AppEvent not found")
    }

    await this.eventRepository.removeAndFlush(event)
  }
}

export default EventService
