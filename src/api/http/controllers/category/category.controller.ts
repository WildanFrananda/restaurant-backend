import { Controller, Get } from "@nestjs/common"
import CategoryService from "src/application/services/category/category.service"

import Category from "src/domain/entities/category.entity"

@Controller("categories")
class CategoriesController {
  constructor(private readonly categoriesService: CategoryService) {}

  @Get()
  public async getCategories(): Promise<Category[]> {
    return await this.categoriesService.getCategories()
  }
}

export default CategoriesController
