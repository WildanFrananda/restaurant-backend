import { IsEnum, IsNotEmpty } from "class-validator"
import BookingStatus from "src/domain/enums/booking-status.enum"

class UpdateBookingStatusDTO {
  @IsNotEmpty()
  @IsEnum(BookingStatus)
  status!: BookingStatus
}

export default UpdateBookingStatusDTO
