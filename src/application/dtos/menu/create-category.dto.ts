import { IsNotEmpty, IsString } from "class-validator"

class CreateCategoryDto {
  @IsNotEmpty()
  @IsString()
  name!: string

  @IsNotEmpty()
  @IsString()
  description!: string

  @IsNotEmpty()
  @IsString()
  imageUrl!: string
}

export default CreateCategoryDto
