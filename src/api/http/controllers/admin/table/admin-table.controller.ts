import { Body, Controller, Param, Put } from "@nestjs/common"
import UpdateTableDto from "src/application/dtos/table/update-table.dto"
import TableService from "src/application/services/table/table.service"
import Admin from "src/common/decorators/admin.decorator"
import Table from "src/domain/entities/table.entity"

@Admin()
@Controller("admin/table")
class AdminTableController {
  constructor(private readonly tableService: TableService) {}

  @Put(":id")
  public async updateTable(@Param(":id") id: string, @Body() dto: UpdateTableDto): Promise<Table> {
    return await this.tableService.updateTable(id, dto)
  }
}

export default AdminTableController
