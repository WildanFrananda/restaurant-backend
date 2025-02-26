import { Injectable, NotFoundException } from "@nestjs/common"
import Category from "src/domain/entities/category.entity"
import CreateCategoryDto from "src/application/dtos/menu/create-category.dto"
import UpdateCategoryDto from "src/application/dtos/menu/update-category.dto"
import CategoryRepository from "src/domain/repositories/category.repository"

@Injectable()
class AdminCategoryService {
  constructor(private readonly categoryRepository: CategoryRepository) {}

  public async createCategory(dto: CreateCategoryDto): Promise<Category> {
    const category: Category = this.categoryRepository.createCategory(
      dto.name,
      dto.description,
      dto.imageUrl
    )

    await this.categoryRepository.persistAndFlush(category)

    return category
  }

  public async updateCategory(id: string, dto: UpdateCategoryDto): Promise<Category> {
    const category = await this.categoryRepository.findCategoryById(id)

    if (!category) {
      throw new NotFoundException("Category not found")
    }
    if (dto.name !== undefined) {
      category.name = dto.name
    }
    if (dto.description !== undefined) {
      category.description = dto.description
    }
    if (dto.imageUrl !== undefined) {
      category.imageUrl = dto.imageUrl
    }

    await this.categoryRepository.persistAndFlush(category)

    return category
  }

  public async deleteCategory(id: string): Promise<void> {
    const category = await this.categoryRepository.findCategoryById(id)

    if (!category) {
      throw new NotFoundException("Category not found")
    }

    await this.categoryRepository.removeAndFlush(category)
  }
}

export default AdminCategoryService
