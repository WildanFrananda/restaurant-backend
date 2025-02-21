import { IsString, IsUrl } from "class-validator"

class UpdateProfileDto {
  @IsString()
  name?: string

  @IsUrl()
  @IsString()
  imageUrl?: string

  address?: unknown
}

export default UpdateProfileDto
