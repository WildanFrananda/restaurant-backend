import { Injectable, NotFoundException, Query } from "@nestjs/common"
import CreateChefDTO from "src/application/dtos/chef/create-chef.dto"
import GetChefsDTO from "src/application/dtos/chef/get-chefs.dto"
import UpdateChefDTO from "src/application/dtos/chef/update-chef.dto"
import Chef from "src/domain/entities/chef.entity"
import ChefRepository from "src/domain/repositories/chef.repository"

@Injectable()
class AdminChefService {
  constructor(private readonly chefRepository: ChefRepository) {}

  public async getChefs(dto: GetChefsDTO): Promise<{
    chefs: Chef[]
    total: number
    page: number
    limit: number
  }> {
    const page = dto.page || 1
    const limit = dto.limit || 10
    const [chefs, total] = await this.chefRepository.findAllChef(page, limit)

    return { chefs, total, page, limit }
  }

  public async createChef(dto: CreateChefDTO): Promise<Chef> {
    const { name, experiences, status, imageUrl } = dto

    const chef = await this.chefRepository.createChef(name, experiences, status, imageUrl)

    return chef
  }

  public async updateChef(id: string, dto: UpdateChefDTO): Promise<Chef> {
    const chef = await this.chefRepository.findOneChef(id)

    if (!chef) {
      throw new NotFoundException("Chef not found")
    }

    if (dto.name !== undefined) {
      chef.name = dto.name
    }

    if (dto.experience !== undefined) {
      chef.experience = dto.experience
    }

    if (dto.status !== undefined) {
      chef.status = dto.status
    }

    if (dto.imageUrl !== undefined) {
      chef.imageUrl = dto.imageUrl
    }

    await this.chefRepository.persistAndFlush(chef)
    return chef
  }

  public async deleteChef(id: string): Promise<void> {
    const chef = await this.chefRepository.findOneChef(id)

    if (!chef) {
      throw new NotFoundException("Chef Not Found")
    }

    await this.chefRepository.removeAndFlush(chef)
  }
}

export default AdminChefService
