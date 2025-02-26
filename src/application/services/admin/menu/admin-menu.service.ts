import type Menu from "src/domain/entities/menu.entity"
import type CreateMenuDto from "src/application/dtos/menu/create-menu.dto"
import type UpdateMenuDto from "src/application/dtos/menu/update-menu.dto"
import type FilterMenuDto from "src/application/dtos/menu/filter-menu.dto"
import { Injectable, NotFoundException } from "@nestjs/common"
import MenuRepository from "src/domain/repositories/menu.repository"
import CategoryRepository from "src/domain/repositories/category.repository"

@Injectable()
class AdminMenuService {
  constructor(
    private readonly menuRepository: MenuRepository,
    private readonly categoryRepository: CategoryRepository
  ) {}

  public async createMenu(dto: CreateMenuDto): Promise<Menu> {
    const category = await this.categoryRepository.findCategoryById(dto.categoryId)

    if (!category) {
      throw new NotFoundException("Category not found")
    }

    const menu: Menu = this.menuRepository.createMenu(
      dto.name,
      dto.description,
      dto.price,
      category,
      dto.isTopWeek ?? false,
      dto.status,
      dto.imageUrl
    )

    await this.menuRepository.persistAndFlush(menu)

    return menu
  }

  public async updateMenu(id: string, dto: UpdateMenuDto): Promise<Menu> {
    const menu: Menu | null = await this.menuRepository.findOneMenuByCategory(id)

    if (!menu) {
      throw new NotFoundException("Menu not found")
    }
    if (dto.name !== undefined) {
      menu.name = dto.name
    }
    if (dto.description !== undefined) {
      menu.description = dto.description
    }
    if (dto.price !== undefined) {
      menu.price = dto.price
    }
    if (dto.categoryId !== undefined) {
      const category = await this.categoryRepository.findCategoryById(dto.categoryId)
      if (!category) {
        throw new NotFoundException("Category not found")
      }
      menu.category = category
    }
    if (dto.isTopWeek !== undefined) {
      menu.isTopWeek = dto.isTopWeek
    }
    if (dto.status !== undefined) {
      menu.status = dto.status
    }
    if (dto.imageUrl !== undefined) {
      menu.imageUrl = dto.imageUrl
    }

    await this.menuRepository.persistAndFlush(menu)

    return menu
  }

  public async deleteMenu(id: string): Promise<void> {
    const menu: Menu | null = await this.menuRepository.findOneMenuById(id)

    if (!menu) {
      throw new NotFoundException("Menu not found")
    }

    await this.menuRepository.removeAndFlush(menu)
  }

  public async getMenus(filterDto: FilterMenuDto): Promise<Menu[]> {
    const conditions: Record<string, unknown> = {}

    if (filterDto.categoryId) {
      conditions.category = { id: filterDto.categoryId }
    }
    if (filterDto.status) {
      conditions.status = filterDto.status
    }
    if (filterDto.isTopWeek !== undefined) {
      conditions.isTopWeek = filterDto.isTopWeek
    }
    if (filterDto.search) {
      conditions.name = { $ilike: `%${filterDto.search}%` }
    }

    return this.menuRepository.menuFilter(conditions)
  }
}

export default AdminMenuService
