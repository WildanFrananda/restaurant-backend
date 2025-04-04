import { MikroOrmModule } from "@mikro-orm/nestjs"
import { Module } from "@nestjs/common"
import AdminBookingController from "src/api/http/controllers/admin/booking/admin-booking.controller"
import AdminCategoryController from "src/api/http/controllers/admin/menu/admin-category.controller"
import AdminMenuController from "src/api/http/controllers/admin/menu/admin-menu.controller"
import AdminTableController from "src/api/http/controllers/admin/table/admin-table.controller"
import AdminBookingService from "src/application/services/admin/booking/admin-booking.service"
import AdminCategoryService from "src/application/services/admin/menu/admin-category.service"
import AdminMenuService from "src/application/services/admin/menu/admin-menu.service"
import TableService from "src/application/services/table/table.service"
import Booking from "src/domain/entities/booking.entity"
import Category from "src/domain/entities/category.entity"
import Menu from "src/domain/entities/menu.entity"
import Table from "src/domain/entities/table.entity"
import BookingRepository from "src/domain/repositories/booking.repository"
import CategoryRepository from "src/domain/repositories/category.repository"
import MenuRepository from "src/domain/repositories/menu.repository"
import TableRepository from "src/domain/repositories/table.repository"
import BookingRepositoryImpl from "src/infrastructure/database/repositories/booking.repository"
import CategoryRepositoryImpl from "src/infrastructure/database/repositories/category.repository"
import MenuRepositoryImpl from "src/infrastructure/database/repositories/menu.repository"
import TableRepositoryImpl from "src/infrastructure/database/repositories/table.repository"

@Module({
  imports: [MikroOrmModule.forFeature([Menu, Category, Booking, Table])],
  providers: [
    AdminMenuService,
    AdminCategoryService,
    AdminBookingService,
    TableService,
    {
      provide: MenuRepository,
      useClass: MenuRepositoryImpl
    },
    {
      provide: CategoryRepository,
      useClass: CategoryRepositoryImpl
    },
    {
      provide: BookingRepository,
      useClass: BookingRepositoryImpl
    },
    {
      provide: TableRepository,
      useClass: TableRepositoryImpl
    }
  ],
  controllers: [
    AdminMenuController,
    AdminCategoryController,
    AdminBookingController,
    AdminTableController
  ]
})
export class AdminModule {}
