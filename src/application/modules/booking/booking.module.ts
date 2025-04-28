import { MikroOrmModule } from "@mikro-orm/nestjs"
import { Module } from "@nestjs/common"
import { JwtModule } from "@nestjs/jwt"
import BookingController from "src/api/http/controllers/booking/booking.controller"
import ChefGateway from "src/api/websocket/gateways/chef/chef.gateway"
import WsAdapterHandler from "src/application/handlers/ws-adapter.handler"
import WsBinary from "src/application/handlers/ws-binary.handler"
import WsConnection from "src/application/handlers/ws-connection.handler"
import WsRoom from "src/application/handlers/ws-room.handler"
import BookingService from "src/application/services/booking/booking.service"
import WsConfig from "src/common/config/ws-config.type"
import DEFAULT_WS_CONFIG from "src/common/config/ws.config"
import WsAuthMiddleware from "src/common/middlewares/websocket/ws-auth.middleware"
import WsRateLimiterMiddleware from "src/common/middlewares/websocket/ws-rate-limit.middleware"
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
  imports: [
    MikroOrmModule.forFeature([Booking, Table, Menu]),
    JwtModule.register({
      secret: process.env.JWT_SECRET || "SECRET",
      signOptions: { expiresIn: "1h" }
    })
  ],
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
    {
      provide: WsConfig,
      useValue: DEFAULT_WS_CONFIG
    },
    WsAdapterHandler,
    WsRoom,
    WsConnection,
    WsBinary,
    WsAuthMiddleware,
    WsRateLimiterMiddleware,
    ChefGateway,
    BookingService
  ]
})
export class BookingModule {}
