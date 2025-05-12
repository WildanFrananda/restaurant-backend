import { AnyEntity, EntityRepository, Reference } from "@mikro-orm/core"
import { InjectRepository } from "@mikro-orm/nestjs"
import { EntityManager } from "@mikro-orm/postgresql"
import { Inject, Injectable } from "@nestjs/common"
import AppEvent from "src/domain/entities/event.entity"
import EventRepository from "src/domain/repositories/event.repository"

@Injectable()
class EventRepositoryImpl extends EventRepository {
  constructor(
    @InjectRepository(AppEvent)
    private readonly eventRepository: EntityRepository<AppEvent>,
    @Inject(EntityManager)
    private readonly em: EntityManager
  ) {
    super()
  }

  public override async persistAndFlush(
    data: object | Reference<object> | Iterable<object | Reference<object>>
  ): Promise<void> {
    this.em.persist(data)
    await this.em.flush()
  }

  public override async removeAndFlush(
    data: AnyEntity | Reference<AnyEntity> | Iterable<AnyEntity | Reference<AnyEntity>>
  ): Promise<void> {
    await this.em.removeAndFlush(data)
  }

  public override createEvent(
    name: string,
    description: string,
    isPopup: boolean,
    imageUrl?: string
  ): AppEvent {
    return this.eventRepository.create({
      name,
      description,
      isPopup,
      imageUrl
    })
  }

  public override async findAllEvents(): Promise<AppEvent[]> {
    return await this.eventRepository.findAll()
  }

  public override async findOneEvent(id: string): Promise<AppEvent | null> {
    return await this.eventRepository.findOne({ id })
  }
}

export default EventRepositoryImpl
