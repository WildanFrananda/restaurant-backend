import { MikroOrmModule } from "@mikro-orm/nestjs"
import { Module } from "@nestjs/common"
import { JwtModule } from "@nestjs/jwt"
import WalletController from "src/api/http/controllers/wallet/wallet.controller"
import WalletGateway from "src/api/websocket/gateways/wallet/wallet.gateway"
import WsAdapterHandler from "src/application/handlers/ws-adapter.handler"
import WsBinary from "src/application/handlers/ws-binary.handler"
import WsConnection from "src/application/handlers/ws-connection.handler"
import WsRoom from "src/application/handlers/ws-room.handler"
import SseService from "src/application/services/sse/sse.service"
import WalletService from "src/application/services/wallet/wallet.service"
import WsConfig from "src/common/config/ws-config.type"
import DEFAULT_WS_CONFIG from "src/common/config/ws.config"
import WsAuthMiddleware from "src/common/middlewares/websocket/ws-auth.middleware"
import WsRateLimiterMiddleware from "src/common/middlewares/websocket/ws-rate-limit.middleware"
import Booking from "src/domain/entities/booking.entity"
import Transaction from "src/domain/entities/transaction.entity"
import UserProfile from "src/domain/entities/user-profile.entity"
import User from "src/domain/entities/user.entity"
import BookingRepository from "src/domain/repositories/booking.repository"
import TransactionRepository from "src/domain/repositories/transaction.repository"
import UserRepository from "src/domain/repositories/user.repository"
import BookingRepositoryImpl from "src/infrastructure/database/repositories/booking.repository"
import TransactionRepositoryImpl from "src/infrastructure/database/repositories/transaction.repository"
import UserRepositoryImpl from "src/infrastructure/database/repositories/user.repository"

@Module({
  imports: [
    MikroOrmModule.forFeature([Transaction, User, UserProfile, Booking]),
    JwtModule.register({
      secret: process.env.JWT_SECRET || "SECRET",
      signOptions: { expiresIn: "1h" }
    })
  ],
  providers: [
    {
      provide: TransactionRepository,
      useClass: TransactionRepositoryImpl
    },
    {
      provide: UserRepository,
      useClass: UserRepositoryImpl
    },
    {
      provide: BookingRepository,
      useClass: BookingRepositoryImpl
    },
    {
      provide: WsConfig,
      useValue: DEFAULT_WS_CONFIG
    },
    WalletService,
    WalletGateway,
    WsAdapterHandler,
    WsRoom,
    WsConnection,
    WsBinary,
    WsAuthMiddleware,
    WsRateLimiterMiddleware,
    SseService
  ],
  controllers: [WalletController]
})
export class WalletModule {}
