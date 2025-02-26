import { Body, Controller, Delete, Get, Param, Post, Put, Query } from "@nestjs/common"
import CreateMenuDto from "src/application/dtos/menu/create-menu.dto"
import FilterMenuDto from "src/application/dtos/menu/filter-menu.dto"
import UpdateMenuDto from "src/application/dtos/menu/update-menu.dto"
import AdminMenuService from "src/application/services/admin/menu/admin-menu.service"
import Admin from "src/common/decorators/admin.decorator"
import Menu from "src/domain/entities/menu.entity"

@Admin()
@Controller("admin/menu")
class AdminMenuController {
  constructor(private readonly adminMenuService: AdminMenuService) {}

  @Post()
  public async createMenu(@Body() dto: CreateMenuDto): Promise<Menu> {
    return this.adminMenuService.createMenu(dto)
  }

  @Put(":id")
  public async updateMenu(@Param("id") id: string, @Body() dto: UpdateMenuDto): Promise<Menu> {
    return this.adminMenuService.updateMenu(id, dto)
  }

  @Delete(":id")
  public async deleteMenu(@Param("id") id: string): Promise<{ message: string }> {
    await this.adminMenuService.deleteMenu(id)

    return { message: "Menu deleted successfully" }
  }

  @Get()
  public async getMenus(@Query() filterDto: FilterMenuDto): Promise<Menu[]> {
    return this.adminMenuService.getMenus(filterDto)
  }
}

export default AdminMenuController
