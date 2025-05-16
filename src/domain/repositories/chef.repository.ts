import { AnyEntity, Loaded, Reference } from "@mikro-orm/postgresql"
import Chef from "../entities/chef.entity"
import ChefStatus from "../enums/chef-status.enum"

abstract class ChefRepository {
  public abstract persistAndFlush(
    data: object | Reference<object> | Iterable<object | Reference<object>>
  ): Promise<void>
  public abstract removeAndFlush(
    data: AnyEntity | Reference<AnyEntity> | Iterable<AnyEntity | Reference<AnyEntity>>
  ): Promise<void>
  public abstract findAllChef(
    limit: number,
    page: number
  ): Promise<[Loaded<Chef, never, "*", never>[], number]>
  public abstract createChef(
    name: string,
    experience: string,
    status: ChefStatus,
    imageUrl: string
  ): Promise<Chef>
  public abstract findOneChef(id: string): Promise<Chef | null>
}

export default ChefRepository
