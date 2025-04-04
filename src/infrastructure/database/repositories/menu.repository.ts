import { InjectRepository } from "@mikro-orm/nestjs"
import {
  AnyEntity,
  EntityManager,
  EntityRepository,
  Loaded,
  Reference
} from "@mikro-orm/postgresql"
import { Inject, Injectable } from "@nestjs/common"
import Category from "src/domain/entities/category.entity"
import Menu from "src/domain/entities/menu.entity"
import MenuStatus from "src/domain/enums/menu-status.enum"
import MenuRepository from "src/domain/repositories/menu.repository"

@Injectable()
class MenuRepositoryImpl extends MenuRepository {
  constructor(
    @InjectRepository(Menu)
    private readonly menuRepository: EntityRepository<Menu>,
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

  public override createMenu(
    name: string,
    description: string | undefined,
    price: number,
    category: Category,
    isTopWeek: boolean,
    status: MenuStatus,
    imageUrl: string
  ): Menu {
    return this.menuRepository.create({
      name,
      description,
      price,
      category,
      isTopWeek,
      status,
      imageUrl
    })
  }

  public override async findAndCountAllMenus(
    limit: number,
    page: number
  ): Promise<[Loaded<Menu, "category", "*", never>[], number]> {
    return await this.menuRepository.findAndCount(
      {},
      {
        limit,
        offset: (page - 1) * limit,
        populate: ["category"],
        orderBy: { name: "ASC" }
      }
    )
  }

  public override async findOneMenuByReviewAndCategory(id: string): Promise<Menu | null> {
    return await this.menuRepository.findOne({ id }, { populate: ["reviews", "category"] })
  }

  public override async findOneMenuById(id: string): Promise<Menu | null> {
    return await this.menuRepository.findOne({ id })
  }

  public override async findOneMenuByCategory(id: string) {
    return await this.menuRepository.findOne({ id }, { populate: ["category"] })
  }

  public override async menuFilter(
    conditions: Record<string, unknown>
  ): Promise<Loaded<Menu, "category", "*", never>[]> {
    return this.menuRepository.find(conditions, {
      populate: ["category"],
      orderBy: { name: "ASC" }
    })
  }
}

export default MenuRepositoryImpl
