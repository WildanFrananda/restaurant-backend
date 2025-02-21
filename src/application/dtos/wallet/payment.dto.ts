import { IsNumber, IsUUID } from "class-validator"

class PaymentDTO {
  @IsUUID()
  bookingId: string

  @IsNumber()
  amount: number
}

export default PaymentDTO
