import { AnyEntity, Reference } from "@mikro-orm/postgresql"
import Event from "../entities/event.entity"

abstract class EventRepository {
  public abstract persistAndFlush(
    data: object | Reference<object> | Iterable<object | Reference<object>>
  ): Promise<void>
  public abstract removeAndFlush(
    data: AnyEntity | Reference<AnyEntity> | Iterable<AnyEntity | Reference<AnyEntity>>
  ): Promise<void>
  public abstract createEvent(
    name: string,
    description: string,
    isPopup: boolean,
    imageUrl?: string
  ): Event
  public abstract findOneEvent(id: string): Promise<Event | null>
}

export default EventRepository
