import { Reference } from "@mikro-orm/core"
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

  public override async findAllCategories(): Promise<Category[]> {
    return await this.categoryRepository.findAll()
  }
}

export default CategoryRepositoryImpl
