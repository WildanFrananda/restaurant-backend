import { IsOptional, IsString, IsBoolean } from "class-validator"
import MenuStatus from "src/domain/enums/menu-status.enum"

class FilterMenuDto {
  @IsOptional()
  @IsString()
  categoryId?: string

  @IsOptional()
  @IsString()
  status?: MenuStatus

  @IsOptional()
  @IsBoolean()
  isTopWeek?: boolean

  @IsOptional()
  @IsString()
  search?: string
}

export default FilterMenuDto
