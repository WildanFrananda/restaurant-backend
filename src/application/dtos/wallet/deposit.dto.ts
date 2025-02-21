import { IsNumber, IsOptional, IsString } from "class-validator"

class DepositDTO {
  @IsNumber()
  amount: number

  @IsString()
  @IsOptional()
  notes?: string
}

export default DepositDTO
