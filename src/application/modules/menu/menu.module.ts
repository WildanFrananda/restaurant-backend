import { MikroOrmModule } from "@mikro-orm/nestjs"
import { Module } from "@nestjs/common"
import MenusController from "src/api/http/controllers/menu/menu.controller"
import MenusService from "src/application/services/menu/menu.service"
import Menu from "src/domain/entities/menu.entity"
import MenuRepository from "src/domain/repositories/menu.repository"
import MenuRepositoryImpl from "src/infrastructure/database/repositories/menu.repository"

@Module({
  imports: [MikroOrmModule.forFeature([Menu])],
  controllers: [MenusController],
  providers: [
    MenusService,
    {
      provide: MenuRepository,
      useClass: MenuRepositoryImpl
    }
  ],
  exports: [MenusService]
})
export class MenusModule {}
