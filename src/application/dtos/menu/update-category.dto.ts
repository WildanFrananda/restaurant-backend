import { IsOptional, IsString } from "class-validator"

class UpdateCategoryDto {
  @IsOptional()
  @IsString()
  name?: string

  @IsOptional()
  @IsString()
  description?: string

  @IsOptional()
  @IsString()
  imageUrl?: string
}

export default UpdateCategoryDto
