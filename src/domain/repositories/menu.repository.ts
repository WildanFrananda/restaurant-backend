import type { AnyEntity, Loaded, Reference } from "@mikro-orm/postgresql"
import type Menu from "../entities/menu.entity"
import MenuStatus from "../enums/menu-status.enum"
import Category from "../entities/category.entity"

abstract class MenuRepository {
  public abstract persistAndFlush(
    data: object | Reference<object> | Iterable<object | Reference<object>>
  ): Promise<void>
  public abstract removeAndFlush(
    data: AnyEntity | Reference<AnyEntity> | Iterable<AnyEntity | Reference<AnyEntity>>
  ): Promise<void>
  public abstract findAndCountAllMenus(
    limit: number,
    page: number
  ): Promise<[Loaded<Menu, "category", "*", never>[], number]>
  public abstract findOneMenuByReviewAndCategory(id: string): Promise<Menu | null>
  public abstract findOneMenuById(id: string): Promise<Menu | null>
  public abstract findOneMenuByCategory(
    id: string
  ): Promise<Loaded<Menu, "category", "*", never> | null>
  public abstract createMenu(
    name: string,
    description: string | undefined,
    price: number,
    category: Category,
    isTopWeek: boolean,
    status: MenuStatus,
    imageUrl: string
  ): Menu
  public abstract menuFilter(
    conditions: Record<string, unknown>
  ): Promise<Loaded<Menu, "category", "*", never>[]>
}

export default MenuRepository
