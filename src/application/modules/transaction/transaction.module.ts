import { MikroOrmModule } from "@mikro-orm/nestjs"
import { Module } from "@nestjs/common"
import TransactionController from "src/api/http/controllers/transaction/transaction.controller"
import TransactionService from "src/application/services/transaction/transaction.service"
import Transaction from "src/domain/entities/transaction.entity"
import TransactionRepository from "src/domain/repositories/transaction.repository"
import TransactionRepositoryImpl from "src/infrastructure/database/repositories/transaction.repository"

@Module({
  imports: [MikroOrmModule.forFeature([Transaction])],
  controllers: [TransactionController],
  providers: [
    {
      provide: TransactionRepository,
      useClass: TransactionRepositoryImpl
    },
    TransactionService
  ]
})
export class TransactionModule {}
