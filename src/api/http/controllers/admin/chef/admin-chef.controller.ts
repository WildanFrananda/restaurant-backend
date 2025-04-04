import { Body, Controller, Delete, Get, Param, Post, Put } from "@nestjs/common"
import CreateChefDTO from "src/application/dtos/chef/create-chef.dto"
import UpdateCategoryDto from "src/application/dtos/menu/update-category.dto"
import AdminChefService from "src/application/services/admin/chef/admin-chef.service"
import Admin from "src/common/decorators/admin.decorator"
import Chef from "src/domain/entities/chef.entity"

@Admin()
@Controller("admin/chef")
class AdminChefController {
  constructor(private readonly adminChefService: AdminChefService) {}

  @Get()
  public async getChefs(): Promise<Chef[]> {
    return await this.adminChefService.getChefs()
  }

  @Post()
  public async createChef(@Body() dto: CreateChefDTO): Promise<Chef> {
    return await this.adminChefService.createChef(dto)
  }

  @Put(":id")
  public async updateChef(@Param("id") id: string, @Body() dto: UpdateCategoryDto): Promise<Chef> {
    return await this.adminChefService.updateChef(id, dto)
  }

  @Delete(":id")
  public async deleteChef(@Param(":id") id: string): Promise<{ message: string }> {
    await this.adminChefService.deleteChef(id)

    return { message: "Chef deleted successfully" }
  }
}

export default AdminChefController
