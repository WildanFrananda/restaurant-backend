import { MikroOrmModule } from "@mikro-orm/nestjs"
import { Module } from "@nestjs/common"
import AdminCategoryController from "src/api/http/controllers/admin/menu/admin-category.controller"
import AdminMenuController from "src/api/http/controllers/admin/menu/admin-menu.controller"
import AdminCategoryService from "src/application/services/admin/menu/admin-category.service"
import AdminMenuService from "src/application/services/admin/menu/admin-menu.service"
import Category from "src/domain/entities/category.entity"
import Menu from "src/domain/entities/menu.entity"
import CategoryRepository from "src/domain/repositories/category.repository"
import MenuRepository from "src/domain/repositories/menu.repository"
import CategoryRepositoryImpl from "src/infrastructure/database/repositories/category.repository"
import MenuRepositoryImpl from "src/infrastructure/database/repositories/menu.repository"

@Module({
  imports: [MikroOrmModule.forFeature([Menu, Category])],
  providers: [
    AdminMenuService,
    AdminCategoryService,
    {
      provide: MenuRepository,
      useClass: MenuRepositoryImpl
    },
    {
      provide: CategoryRepository,
      useClass: CategoryRepositoryImpl
    }
  ],
  controllers: [AdminMenuController, AdminCategoryController]
})
export class AdminModule {}
