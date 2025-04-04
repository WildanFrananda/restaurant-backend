import { Controller, Get } from "@nestjs/common"
import TableService from "src/application/services/table/table.service"
import Table from "src/domain/entities/table.entity"

@Controller("tables")
class TableController {
  constructor(private readonly tableService: TableService) {}

  @Get()
  public async getTables(): Promise<Table[]> {
    return this.tableService.getTables()
  }
}

export default TableController
