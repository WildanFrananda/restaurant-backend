import { IsNotEmpty, IsNumber, IsOptional, IsString, Min, Max } from "class-validator"

class CreateReviewDTO {
  @IsNotEmpty()
  @IsString()
  bookingId!: string

  @IsNotEmpty()
  @IsString()
  menuId!: string

  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  @Max(5)
  rating!: number

  @IsOptional()
  @IsString()
  comment?: string
}

export default CreateReviewDTO
