import { Injectable, NotFoundException } from "@nestjs/common"
import UpdateTableDto from "src/application/dtos/table/update-table.dto"
import Table from "src/domain/entities/table.entity"
import TableRepository from "src/domain/repositories/table.repository"

@Injectable()
class TableService {
  constructor(private readonly tableRepository: TableRepository) {}

  public async getTables(): Promise<Table[]> {
    return await this.tableRepository.findAll()
  }

  public async updateTable(id: string, dto: UpdateTableDto): Promise<Table> {
    const { status } = dto
    const table = await this.tableRepository.findOneTable(id)

    if (!table) {
      throw new NotFoundException("Table not found")
    }

    table.status = status

    await this.tableRepository.persistAndFlush(table)

    return table
  }
}

export default TableService
