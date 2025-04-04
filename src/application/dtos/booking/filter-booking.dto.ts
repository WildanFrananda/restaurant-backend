import { IsEnum, IsOptional, IsString } from "class-validator"
import BookingStatus from "src/domain/enums/booking-status.enum"
import BookingType from "src/domain/enums/booking-type.enum"

class FilterBookingDTO {
  @IsOptional()
  @IsEnum(BookingStatus)
  status?: BookingStatus

  @IsOptional()
  @IsEnum(BookingType)
  type?: BookingType

  @IsOptional()
  @IsString()
  chefAssigned?: "true" | "false"
}

export default FilterBookingDTO
