import { IsOptional, IsEnum, IsInt, Min, IsDateString } from "class-validator"
import { Type } from "class-transformer"
import BookingStatus from "src/domain/enums/booking-status.enum"
import BookingType from "src/domain/enums/booking-type.enum"

class GetBookingHistoryDto {
  @IsOptional()
  @IsEnum(BookingStatus)
  status?: BookingStatus

  @IsOptional()
  @IsEnum(BookingType)
  type?: BookingType

  @IsOptional()
  @IsDateString()
  startDate?: string

  @IsOptional()
  @IsDateString()
  endDate?: string

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

export default GetBookingHistoryDto
