import { IsOptional, IsNumber, Min, Max, IsString } from "class-validator"

class UpdateReviewDto {
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(5)
  rating?: number

  @IsOptional()
  @IsString()
  comment?: string
}

export default UpdateReviewDto
