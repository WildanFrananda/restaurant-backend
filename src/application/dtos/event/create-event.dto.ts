import { IsNotEmpty, IsString, IsBoolean, IsOptional } from "class-validator"

class CreateEventDTO {
  @IsNotEmpty()
  @IsString()
  name!: string

  @IsNotEmpty()
  @IsString()
  description!: string

  @IsNotEmpty()
  @IsBoolean()
  isPopup!: boolean

  @IsOptional()
  @IsString()
  imageUrl?: string
}

export default CreateEventDTO
