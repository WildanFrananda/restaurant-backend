import { MikroOrmModule } from "@mikro-orm/nestjs"
import { Module } from "@nestjs/common"
import BookingController from "src/api/http/controllers/booking/booking.controller"
import BookingService from "src/application/services/booking/booking.service"
import Booking from "src/domain/entities/booking.entity"
import Menu from "src/domain/entities/menu.entity"
import Table from "src/domain/entities/table.entity"
import BookingRepository from "src/domain/repositories/booking.repository"
import MenuRepository from "src/domain/repositories/menu.repository"
import TableRepository from "src/domain/repositories/table.repository"
import BookingRepositoryImpl from "src/infrastructure/database/repositories/booking.repository"
import MenuRepositoryImpl from "src/infrastructure/database/repositories/menu.repository"
import TableRepositoryImpl from "src/infrastructure/database/repositories/table.repository"

@Module({
  imports: [MikroOrmModule.forFeature([Booking, Table, Menu])],
  controllers: [BookingController],
  providers: [
    {
      provide: BookingRepository,
      useClass: BookingRepositoryImpl
    },
    {
      provide: TableRepository,
      useClass: TableRepositoryImpl
    },
    {
      provide: MenuRepository,
      useClass: MenuRepositoryImpl
    },
    BookingService
  ]
})
export class BookingModule {}