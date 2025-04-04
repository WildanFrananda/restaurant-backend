import { IsNotEmpty, IsString } from "class-validator"

class AssignChefDTO {
  @IsNotEmpty()
  @IsString()
  chefId!: string
}

export default AssignChefDTO
