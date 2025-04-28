import { MikroOrmModule } from "@mikro-orm/nestjs"
import { CacheModule } from "@nestjs/cache-manager"
import { Module } from "@nestjs/common"
import { ConfigModule } from "@nestjs/config"
import { redisStore } from "cache-manager-redis-store"
import { AuthModule } from "./application/modules/auth/auth.module"
import { TsMorphMetadataProvider } from "@mikro-orm/reflection"
import { PostgreSqlDriver } from "@mikro-orm/postgresql"
import { UserProfileModule } from "./application/modules/profile/user-profile.module"
import { WalletModule } from "./application/modules/wallet/wallet.module"
import { TransactionModule } from "./application/modules/transaction/transaction.module"
import { MenusModule } from "./application/modules/menu/menu.module"
import { CategoriesModule } from "./application/modules/category/category.module"
import { AdminModule } from "./application/modules/admin/admin.module"
import { BookingModule } from "./application/modules/booking/booking.module"
import { TableModule } from "./application/modules/table/table.module"
import { ReviewModule } from "./application/modules/review/review.module"
import { EventModule } from "./application/modules/event/event.module"
import { ThrottlerModule } from "@nestjs/throttler"

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true
    }),
    MikroOrmModule.forRoot({
      dbName: process.env.DATABASE_NAME || "restaurant_db_dev",
      user: process.env.DATABASE_USER || "postgres",
      password: process.env.DATABASE_PASSWORD || "postgres_dev",
      host: process.env.DATABASE_HOST || "postgres",
      port: Number(process.env.DATABASE_PORT) || 5432,
      metadataProvider: TsMorphMetadataProvider,
      driver: PostgreSqlDriver,
      autoLoadEntities: true
    }),
    CacheModule.register({
      isGlobal: true,
      store: redisStore,
      host: process.env.REDIS_HOST,
      port: parseInt(process.env.REDIS_PORT || "6379"),
      ttl: 60 * 5 // 5 minutes cache time
    }),
    ThrottlerModule.forRoot([{
      name: "default",
      limit: 100,
      ttl: 60
    }]),
    AuthModule,
    UserProfileModule,
    WalletModule,
    TransactionModule,
    MenusModule,
    CategoriesModule,
    BookingModule,
    TableModule,
    ReviewModule,
    EventModule,
    AdminModule
  ],
  controllers: [],
  providers: []
})
export class AppModule {}
