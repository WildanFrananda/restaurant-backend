import { Type } from "class-transformer"
import { IsDateString, IsEnum, IsOptional, Min } from "class-validator"
import TransactionStatus from "src/domain/enums/transaction-status.enum"
import TransactionType from "src/domain/enums/transaction-type.enum"

class GetTransactionDTO {
  @IsOptional()
  @Type(() => Number)
  @Min(1)
  page?: number = 1

  @IsOptional()
  @Type(() => Number)
  @Min(1)
  limit?: number = 10

  @IsOptional()
  @IsEnum(TransactionType)
  type?: TransactionType

  @IsOptional()
  @IsEnum(TransactionStatus)
  status?: TransactionStatus

  @IsOptional()
  @IsDateString()
  startDate?: string

  @IsOptional()
  @IsDateString()
  endDate?: string
}

export default GetTransactionDTO
