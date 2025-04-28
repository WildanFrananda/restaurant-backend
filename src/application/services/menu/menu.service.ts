import type Menu from "src/domain/entities/menu.entity"
import type GetMenusDto from "src/application/dtos/menu/get-menu.dto"
import { Injectable, Logger, NotFoundException } from "@nestjs/common"
import CacheService from "src/infrastructure/cache/cache.service"
import MenuRepository from "src/domain/repositories/menu.repository"

@Injectable()
class MenusService {
  private readonly logger = new Logger(MenusService.name)

  constructor(
    private readonly menuRepository: MenuRepository,
    private readonly cacheManager: CacheService
  ) {}

  public async getMenus(
    getMenusDto: GetMenusDto
  ): Promise<{ data: Menu[]; total: number; page: number; limit: number }> {
    const page = getMenusDto.page || 1
    const limit = getMenusDto.limit || 10
    const cacheKey = `menus:page:${page}:limit:${limit}`
    const cached = await this.cacheManager.get<{ data: Menu[]; total: number }>(cacheKey)

    if (cached) {
      this.logger.log(`Returning cached menus for key: ${cacheKey}`)

      return { ...cached, page, limit }
    }

    const [data, total] = await this.menuRepository.findAndCountAllMenus(limit, page)

    await this.cacheManager.set(cacheKey, { data, total }, 60 * 5)

    return { data, total, page, limit }
  }

  public async getMenuById(id: string): Promise<Menu & { rating: number }> {
    const menu = await this.menuRepository.findOneMenuByReviewAndCategory(id)

    if (!menu) {
      throw new NotFoundException("Menu not found")
    }

    let rating = 0

    if (menu.reviews && menu.reviews.length > 0) {
      const reviews = menu.reviews.getItems()
      const sum = reviews.reduce((acc, review) => acc + Number(review.rating), 0)
      rating = sum / reviews.length
    }

    return { ...menu, rating }
  }
}

export default MenusService
