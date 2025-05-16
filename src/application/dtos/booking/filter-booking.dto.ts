import { Type } from "class-transformer"
import { IsEnum, IsInt, IsOptional, IsString, Min } from "class-validator"
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

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page: number = 1

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit: number = 10
}

export default FilterBookingDTO
