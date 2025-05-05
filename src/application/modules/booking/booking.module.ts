import { MikroOrmModule } from "@mikro-orm/nestjs"
import { Module } from "@nestjs/common"
import { JwtModule } from "@nestjs/jwt"

// Controllers
import BookingController from "src/api/http/controllers/booking/booking.controller"

// Gateways
import ChefGateway from "src/api/websocket/gateways/chef/chef.gateway"
import WalletGateway from "src/api/websocket/gateways/wallet/wallet.gateway"

// Handlers
import WsAdapterHandler from "src/application/handlers/ws-adapter.handler"
import WsBinary from "src/application/handlers/ws-binary.handler"
import WsConnection from "src/application/handlers/ws-connection.handler"
import WsRoom from "src/application/handlers/ws-room.handler"

// Services
import BookingService from "src/application/services/booking/booking.service"
import AdminWalletSSEService from "src/application/services/sse/wallet/admin-wallet-sse.service"
import WalletSSEService from "src/application/services/sse/wallet/wallet-sse.service"
import WalletService from "src/application/services/wallet/wallet.service"

// Config
import WsConfig from "src/common/config/ws-config.type"
import DEFAULT_WS_CONFIG from "src/common/config/ws.config"

// Middlewares
import WsAuthMiddleware from "src/common/middlewares/websocket/ws-auth.middleware"
import WsRateLimiterMiddleware from "src/common/middlewares/websocket/ws-rate-limit.middleware"

// Entities
import BookingMenu from "src/domain/entities/booking-menu.entity"
import Booking from "src/domain/entities/booking.entity"
import Menu from "src/domain/entities/menu.entity"
import Table from "src/domain/entities/table.entity"
import Transaction from "src/domain/entities/transaction.entity"
import UserProfile from "src/domain/entities/user-profile.entity"
import User from "src/domain/entities/user.entity"

// Repositories
import BookingMenuRepository from "src/domain/repositories/booking-menu.repository"
import BookingRepository from "src/domain/repositories/booking.repository"
import MenuRepository from "src/domain/repositories/menu.repository"
import TableRepository from "src/domain/repositories/table.repository"
import TransactionRepository from "src/domain/repositories/transaction.repository"
import UserRepository from "src/domain/repositories/user.repository"

// Repository Implementations
import BookingMenuRepositoryImpl from "src/infrastructure/database/repositories/booking-menu.repository"
import BookingRepositoryImpl from "src/infrastructure/database/repositories/booking.repository"
import MenuRepositoryImpl from "src/infrastructure/database/repositories/menu.repository"
import TableRepositoryImpl from "src/infrastructure/database/repositories/table.repository"
import TransactionRepositoryImpl from "src/infrastructure/database/repositories/transaction.repository"
import UserRepositoryImpl from "src/infrastructure/database/repositories/user.repository"

@Module({
  imports: [
    MikroOrmModule.forFeature([
      Booking,
      Table,
      Menu,
      BookingMenu,
      Transaction,
      User,
      UserProfile
    ]),
    JwtModule.register({
      secret: process.env.JWT_SECRET || "SECRET",
      signOptions: { expiresIn: "1h" }
    })
  ],
  controllers: [BookingController],
  providers: [
    // Repository Bindings
    { provide: BookingRepository, useClass: BookingRepositoryImpl },
    { provide: TableRepository, useClass: TableRepositoryImpl },
    { provide: MenuRepository, useClass: MenuRepositoryImpl },
    { provide: BookingMenuRepository, useClass: BookingMenuRepositoryImpl },
    { provide: TransactionRepository, useClass: TransactionRepositoryImpl },
    { provide: UserRepository, useClass: UserRepositoryImpl },

    // Config
    { provide: WsConfig, useValue: DEFAULT_WS_CONFIG },

    // Services
    WalletService,
    BookingService,
    WalletSSEService,
    AdminWalletSSEService,

    // Handlers
    WsAdapterHandler,
    WsRoom,
    WsConnection,
    WsBinary,

    // Middlewares
    WsAuthMiddleware,
    WsRateLimiterMiddleware,

    // Gateways
    ChefGateway,
    WalletGateway
  ]
})
export class BookingModule {}
