import { Type } from "class-transformer"
import {
  IsArray,
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  ValidateNested
} from "class-validator"
import BookingType from "src/domain/enums/booking-type.enum"

class MenuItemDTO {
  @IsNotEmpty()
  @IsString()
  menuId!: string

  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  quantity!: number
}

class CreateBookingDTO {
  @IsNotEmpty()
  @IsEnum(BookingType)
  type!: BookingType

  @IsNotEmpty()
  @IsDateString()
  schedule?: string

  @IsOptional()
  @IsString()
  tableId?: string

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => MenuItemDTO)
  menuItems?: MenuItemDTO[]

  @IsOptional()
  @IsString()
  location?: string
}

export default CreateBookingDTO
