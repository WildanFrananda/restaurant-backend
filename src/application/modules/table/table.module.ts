import { MikroOrmModule } from "@mikro-orm/nestjs"
import { Module } from "@nestjs/common"
import TableController from "src/api/http/controllers/table/table.controller"
import TableService from "src/application/services/table/table.service"
import Table from "src/domain/entities/table.entity"
import TableRepository from "src/domain/repositories/table.repository"
import TableRepositoryImpl from "src/infrastructure/database/repositories/table.repository"

@Module({
  imports: [MikroOrmModule.forFeature([Table])],
  controllers: [TableController],
  providers: [
    {
      provide: TableRepository,
      useClass: TableRepositoryImpl
    },
    TableService
  ]
})
export class TableModule {}
