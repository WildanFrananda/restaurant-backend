import { Reference } from "@mikro-orm/core"
import { InjectRepository } from "@mikro-orm/nestjs"
import { EntityManager, EntityRepository } from "@mikro-orm/postgresql"
import { Inject, Injectable } from "@nestjs/common"
import Table from "src/domain/entities/table.entity"
import TableRepository from "src/domain/repositories/table.repository"

@Injectable()
class TableRepositoryImpl extends TableRepository {
  constructor(
    @InjectRepository(Table)
    private readonly tableRepository: EntityRepository<Table>,
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

  public override async findAll(): Promise<Table[]> {
    return await this.tableRepository.findAll()
  }

  public override async findOneTable(id: string): Promise<Table | null> {
    return await this.tableRepository.findOne({ id })
  }
}

export default TableRepositoryImpl
