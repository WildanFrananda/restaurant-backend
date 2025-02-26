import { Body, Controller, Delete, Param, Post, Put } from "@nestjs/common"
import type CreateCategoryDto from "src/application/dtos/menu/create-category.dto"
import type UpdateCategoryDto from "src/application/dtos/menu/update-category.dto"
import AdminCategoryService from "src/application/services/admin/menu/admin-category.service"
import Admin from "src/common/decorators/admin.decorator"
import Category from "src/domain/entities/category.entity"

@Admin()
@Controller("admin/category")
class AdminCategoryController {
  constructor(private readonly adminCategoryService: AdminCategoryService) {}

  @Post()
  public async createCategory(@Body() dto: CreateCategoryDto): Promise<Category> {
    return this.adminCategoryService.createCategory(dto)
  }

  @Put(":id")
  public async updateCategory(
    @Param("id") id: string,
    @Body() dto: UpdateCategoryDto
  ): Promise<Category> {
    return this.adminCategoryService.updateCategory(id, dto)
  }

  @Delete(":id")
  public async deleteCategory(@Param("id") id: string): Promise<{ message: string }> {
    await this.adminCategoryService.deleteCategory(id)

    return { message: "Category deleted successfully" }
  }
}

export default AdminCategoryController
