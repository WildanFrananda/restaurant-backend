import { IsOptional, IsInt, Min } from "class-validator"
import { Type } from "class-transformer"

class GetChefsDTO {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page: number = 1

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit: number = 10
}

export default GetChefsDTO
