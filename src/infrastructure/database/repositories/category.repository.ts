import { AnyEntity, Reference } from "@mikro-orm/core"
import { InjectRepository } from "@mikro-orm/nestjs"
import { EntityManager, EntityRepository } from "@mikro-orm/postgresql"
import { Inject, Injectable } from "@nestjs/common"
import Category from "src/domain/entities/category.entity"
import CategoryRepository from "src/domain/repositories/category.repository"

@Injectable()
class CategoryRepositoryImpl extends CategoryRepository {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: EntityRepository<Category>,
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

  public override createCategory(name: string, description: string, imageUrl: string): Category {
    return this.categoryRepository.create({ name, description, imageUrl })
  }

  public override async findCategoryById(id: string): Promise<Category | null> {
    return await this.categoryRepository.findOne({ id })
  }

  public override async findAllCategories(): Promise<Category[]> {
    return await this.categoryRepository.findAll()
  }
}

export default CategoryRepositoryImpl
