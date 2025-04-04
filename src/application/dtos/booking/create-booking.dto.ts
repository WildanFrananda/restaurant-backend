import { IsDateString, IsEnum, IsNotEmpty, IsOptional, IsString } from "class-validator"
import BookingType from "src/domain/enums/booking-type.enum"

class CreateBookingDTO {
  @IsNotEmpty()
  @IsEnum(BookingType)
  type!: BookingType

  @IsNotEmpty()
  @IsDateString()
  schedule!: string

  @IsOptional()
  @IsString()
  tableId?: string

  @IsOptional()
  @IsString()
  menuId?: string

  @IsOptional()
  @IsString()
  location?: string
}

export default CreateBookingDTO
