import { IsEnum } from "class-validator"
import TableStatus from "src/domain/enums/table-status.enum"

class UpdateTableDto {
  @IsEnum(TableStatus)
  status!: TableStatus
}

export default UpdateTableDto
