import { MikroOrmModule } from "@mikro-orm/nestjs"
import { Module } from "@nestjs/common"
import { JwtModule } from "@nestjs/jwt"
import AdminBookingController from "src/api/http/controllers/admin/booking/admin-booking.controller"
import AdminChefController from "src/api/http/controllers/admin/chef/admin-chef.controller"
import AdminCategoryController from "src/api/http/controllers/admin/menu/admin-category.controller"
import AdminMenuController from "src/api/http/controllers/admin/menu/admin-menu.controller"
import AdminTableController from "src/api/http/controllers/admin/table/admin-table.controller"
import AdminUserController from "src/api/http/controllers/admin/user/admin-user.controller"
import ChefGateway from "src/api/websocket/gateways/chef/chef.gateway"
import WsAdapterHandler from "src/application/handlers/ws-adapter.handler"
import WsBinary from "src/application/handlers/ws-binary.handler"
import WsConnection from "src/application/handlers/ws-connection.handler"
import WsRoom from "src/application/handlers/ws-room.handler"
import AdminBookingService from "src/application/services/admin/booking/admin-booking.service"
import AdminChefService from "src/application/services/admin/chef/admin-chef.service"
import AdminCategoryService from "src/application/services/admin/menu/admin-category.service"
import AdminMenuService from "src/application/services/admin/menu/admin-menu.service"
import AdminUserService from "src/application/services/admin/user/admin-user.service"
import TableService from "src/application/services/table/table.service"
import UserProfileService from "src/application/services/user/user.service"
import WsConfig from "src/common/config/ws-config.type"
import DEFAULT_WS_CONFIG from "src/common/config/ws.config"
import WsAuthMiddleware from "src/common/middlewares/websocket/ws-auth.middleware"
import WsRateLimiterMiddleware from "src/common/middlewares/websocket/ws-rate-limit.middleware"
import Booking from "src/domain/entities/booking.entity"
import Category from "src/domain/entities/category.entity"
import Chef from "src/domain/entities/chef.entity"
import Menu from "src/domain/entities/menu.entity"
import Table from "src/domain/entities/table.entity"
import UserProfile from "src/domain/entities/user-profile.entity"
import User from "src/domain/entities/user.entity"
import BookingRepository from "src/domain/repositories/booking.repository"
import CategoryRepository from "src/domain/repositories/category.repository"
import ChefRepository from "src/domain/repositories/chef.repository"
import MenuRepository from "src/domain/repositories/menu.repository"
import TableRepository from "src/domain/repositories/table.repository"
import UserRepository from "src/domain/repositories/user.repository"
import BookingRepositoryImpl from "src/infrastructure/database/repositories/booking.repository"
import CategoryRepositoryImpl from "src/infrastructure/database/repositories/category.repository"
import ChefRepositoryImpl from "src/infrastructure/database/repositories/chef.repository"
import MenuRepositoryImpl from "src/infrastructure/database/repositories/menu.repository"
import TableRepositoryImpl from "src/infrastructure/database/repositories/table.repository"
import UserRepositoryImpl from "src/infrastructure/database/repositories/user.repository"

@Module({
  imports: [
    MikroOrmModule.forFeature([Chef, Menu, Category, Booking, Table, User, UserProfile]),
    JwtModule.register({
      secret: process.env.JWT_SECRET || "SECRET",
      signOptions: { expiresIn: "1h" }
    })
  ],
  providers: [
    {
      provide: UserRepository,
      useClass: UserRepositoryImpl
    },
    {
      provide: ChefRepository,
      useClass: ChefRepositoryImpl
    },
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
    },
    {
      provide: WsConfig,
      useValue: DEFAULT_WS_CONFIG
    },
    AdminUserService,
    AdminMenuService,
    AdminCategoryService,
    AdminBookingService,
    AdminChefService,
    TableService,
    WsAdapterHandler,
    WsRoom,
    WsConnection,
    WsBinary,
    WsAuthMiddleware,
    WsRateLimiterMiddleware,
    ChefGateway
  ],
  controllers: [
    AdminChefController,
    AdminMenuController,
    AdminCategoryController,
    AdminBookingController,
    AdminTableController,
    AdminUserController
  ]
})
export class AdminModule {}
