import type { Reference } from "@mikro-orm/postgresql"
import type Category from "../entities/category.entity"

abstract class CategoryRepository {
  public abstract persistAndFlush(
    data: object | Reference<object> | Iterable<object | Reference<object>>
  ): Promise<void>
  public abstract findAllCategories(): Promise<Category[]>
}

export default CategoryRepository
