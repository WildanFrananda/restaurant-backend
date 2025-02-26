import { Controller, Get, Param, Query, NotFoundException } from "@nestjs/common"
import GetMenusDto from "src/application/dtos/menu/get-menu.dto"
import MenusService from "src/application/services/menu/menu.service"
import Menu from "src/domain/entities/menu.entity"

@Controller("menus")
class MenusController {
  constructor(private readonly menusService: MenusService) {}

  @Get()
  async getMenus(
    @Query() getMenusDto: GetMenusDto
  ): Promise<{ data: Menu[]; total: number; page: number; limit: number }> {
    return this.menusService.getMenus(getMenusDto)
  }

  @Get(":id")
  async getMenuById(@Param("id") id: string): Promise<Menu & { rating: number }> {
    const menu = await this.menusService.getMenuById(id)

    if (!menu) {
      throw new NotFoundException("Menu not found")
    }

    return menu
  }
}

export default MenusController
