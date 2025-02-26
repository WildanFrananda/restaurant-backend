import type { AnyEntity, Reference } from "@mikro-orm/postgresql"
import type Category from "../entities/category.entity"

abstract class CategoryRepository {
  public abstract persistAndFlush(
    data: object | Reference<object> | Iterable<object | Reference<object>>
  ): Promise<void>
  public abstract findAllCategories(): Promise<Category[]>
  public abstract findCategoryById(id: string): Promise<Category | null>
  public abstract createCategory(name: string, description: string, imageUrl: string): Category
  public abstract removeAndFlush(
    data: AnyEntity | Reference<AnyEntity> | Iterable<AnyEntity | Reference<AnyEntity>>
  ): Promise<void>
}

export default CategoryRepository
