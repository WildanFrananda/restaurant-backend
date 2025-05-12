import { AnyEntity, Reference } from "@mikro-orm/postgresql"
import AppEvent from "../entities/event.entity"

abstract class EventRepository {
  public abstract persistAndFlush(
    data: object | Reference<object> | Iterable<object | Reference<object>>
  ): Promise<void>
  public abstract removeAndFlush(
    data: AnyEntity | Reference<AnyEntity> | Iterable<AnyEntity | Reference<AnyEntity>>
  ): Promise<void>
  public abstract findAllEvents(): Promise<AppEvent[]>
  public abstract createEvent(
    name: string,
    description: string,
    isPopup: boolean,
    imageUrl?: string
  ): AppEvent
  public abstract findOneEvent(id: string): Promise<AppEvent | null>
}

export default EventRepository
