import { IsOptional, IsString, IsBoolean } from "class-validator"

class UpdateEventDTO {
  @IsOptional()
  @IsString()
  name?: string

  @IsOptional()
  @IsString()
  description?: string

  @IsOptional()
  @IsBoolean()
  isPopup?: boolean

  @IsOptional()
  @IsString()
  imageUrl?: string
}

export default UpdateEventDTO
