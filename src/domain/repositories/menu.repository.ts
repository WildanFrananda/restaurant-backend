import { Reference } from "@mikro-orm/postgresql"

abstract class MenuRepository {
  public abstract persistAndFlush(
    data: object | Reference<object> | Iterable<object | Reference<object>>
  ): Promise<void>
  public abstract findAndCountAllMenus(): Promise<[unknown[], number]>
}

export default MenuRepository
