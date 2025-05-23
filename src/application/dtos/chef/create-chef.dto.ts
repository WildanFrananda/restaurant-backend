import { IsEnum, IsNotEmpty, IsString } from "class-validator"
import ChefStatus from "src/domain/enums/chef-status.enum"

class CreateChefDTO {
  @IsNotEmpty()
  @IsString()
  name!: string

  @IsNotEmpty()
  @IsString()
  experience!: string

  @IsNotEmpty()
  @IsEnum(ChefStatus)
  status!: ChefStatus

  @IsNotEmpty()
  @IsString()
  imageUrl: string
}

export default CreateChefDTO
