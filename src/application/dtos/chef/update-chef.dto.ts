import { IsEnum, IsOptional, IsString } from "class-validator"
import ChefStatus from "src/domain/enums/chef-status.enum"

class UpdateChefDTO {
  @IsOptional()
  @IsString()
  name?: string

  @IsOptional()
  @IsString()
  experience?: string

  @IsOptional()
  @IsEnum(ChefStatus)
  status?: ChefStatus

  @IsOptional()
  @IsString()
  imageUrl?: string

  @IsOptional()
  @IsString()
  location?: string
}

export default UpdateChefDTO
