import { Module } from "@nestjs/common"
import { MikroOrmModule } from "@mikro-orm/nestjs"
import Category from "src/domain/entities/category.entity"
import CategoriesController from "src/api/http/controllers/category/category.controller"
import CategoryService from "src/application/services/category/category.service"
import CategoryRepository from "src/domain/repositories/category.repository"
import CategoryRepositoryImpl from "src/infrastructure/database/repositories/category.repository"

@Module({
  imports: [MikroOrmModule.forFeature([Category])],
  controllers: [CategoriesController],
  providers: [
    CategoryService,
    {
      provide: CategoryRepository,
      useClass: CategoryRepositoryImpl
    }
  ],
  exports: [CategoryService]
})
export class CategoriesModule {}
