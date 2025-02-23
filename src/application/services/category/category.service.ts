import type Category from "src/domain/entities/category.entity"
import { Injectable } from "@nestjs/common"
import CategoryRepository from "src/domain/repositories/category.repository"

@Injectable()
class CategoryService {
  constructor(private readonly categoryRepository: CategoryRepository) {}

  public async getCategories(): Promise<Category[]> {
    return await this.categoryRepository.findAllCategories()
  }
}

export default CategoryService
