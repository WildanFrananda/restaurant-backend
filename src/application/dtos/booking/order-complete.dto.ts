import { IsNotEmpty, IsString } from "class-validator"

class OrderCompleteDTO {
  @IsNotEmpty()
  @IsString()
  bookingId!: string

  @IsNotEmpty()
  @IsString()
  chefId!: string
}

export default OrderCompleteDTO
