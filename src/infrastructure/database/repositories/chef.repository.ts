import { AnyEntity, Loaded, Reference } from "@mikro-orm/core"
import { InjectRepository } from "@mikro-orm/nestjs"
import { EntityManager, EntityRepository } from "@mikro-orm/postgresql"
import { Inject, Injectable } from "@nestjs/common"
import Chef from "src/domain/entities/chef.entity"
import ChefStatus from "src/domain/enums/chef-status.enum"
import ChefRepository from "src/domain/repositories/chef.repository"

@Injectable()
class ChefRepositoryImpl extends ChefRepository {
  constructor(
    @InjectRepository(Chef)
    private readonly chefRepository: EntityRepository<Chef>,
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

  public override async findAllChef(): Promise<Chef[]> {
    return await this.chefRepository.findAll()
  }

  public override async createChef(
    name: string,
    experience: string,
    status: ChefStatus,
    imageUrl: string
  ): Promise<Chef> {
    const chef = this.chefRepository.create({
      name,
      experience,
      status,
      imageUrl
    })

    await this.persistAndFlush(chef)

    return chef
  }

  public override async findOneChef(id: string): Promise<Chef | null> {
    return await this.chefRepository.findOne({ id })
  }
}

export default ChefRepositoryImpl
