import { IsOptional, IsString, IsNumber, IsBoolean } from "class-validator"
import MenuStatus from "src/domain/enums/menu-status.enum"

class UpdateMenuDto {
  @IsOptional()
  @IsString()
  name?: string

  @IsOptional()
  @IsString()
  description?: string

  @IsOptional()
  @IsNumber()
  price?: number

  @IsOptional()
  @IsString()
  categoryId?: string

  @IsOptional()
  @IsBoolean()
  isTopWeek?: boolean

  @IsOptional()
  @IsString()
  status?: MenuStatus

  @IsOptional()
  @IsString()
  imageUrl?: string
}

export default UpdateMenuDto
