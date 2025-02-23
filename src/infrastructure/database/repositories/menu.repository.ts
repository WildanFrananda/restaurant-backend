import { Reference } from "@mikro-orm/core"
import { InjectRepository } from "@mikro-orm/nestjs"
import { EntityManager, EntityRepository } from "@mikro-orm/postgresql"
import { Inject } from "@nestjs/common"
import Menu from "src/domain/entities/menu.entity"
import MenuRepository from "src/domain/repositories/menu.repository"

class MenuRepositoryImpl extends MenuRepository {
  constructor(
    @InjectRepository(Menu)
    private readonly categoryRepository: EntityRepository<Menu>,
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
  public override async findAndCountAllMenus(): Promise<[unknown[], number]> {
    throw new Error("Method not implemented.")
  }
}

export default MenuRepositoryImpl
