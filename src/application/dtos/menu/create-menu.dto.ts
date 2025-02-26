import type MenuStatus from "src/domain/enums/menu-status.enum"
import { IsNotEmpty, IsString, IsOptional, IsNumber, IsBoolean } from "class-validator"

class CreateMenuDto {
  @IsNotEmpty()
  @IsString()
  name!: string

  @IsOptional()
  @IsString()
  description?: string

  @IsNotEmpty()
  @IsNumber()
  price!: number

  @IsNotEmpty()
  @IsString()
  categoryId!: string

  @IsOptional()
  @IsBoolean()
  isTopWeek?: boolean

  @IsNotEmpty()
  @IsString()
  status!: MenuStatus

  @IsNotEmpty()
  @IsString()
  imageUrl!: string
}

export default CreateMenuDto
