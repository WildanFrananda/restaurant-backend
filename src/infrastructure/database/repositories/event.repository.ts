import { AnyEntity, EntityRepository, Reference } from "@mikro-orm/core"
import { InjectRepository } from "@mikro-orm/nestjs"
import { EntityManager } from "@mikro-orm/postgresql"
import { Inject, Injectable } from "@nestjs/common"
import Event from "src/domain/entities/event.entity"
import EventRepository from "src/domain/repositories/event.repository"

@Injectable()
class EventRepositoryImpl extends EventRepository {
  constructor(
    @InjectRepository(Event)
    private readonly eventRepository: EntityRepository<Event>,
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
  ): Event {
    return this.eventRepository.create({
      name,
      description,
      isPopup,
      imageUrl
    })
  }

  public override async findOneEvent(id: string): Promise<Event | null> {
    return await this.eventRepository.findOne({ id })
  }
}

export default EventRepositoryImpl
