import { Reference } from "@mikro-orm/postgresql"
import Table from "../entities/table.entity"

abstract class TableRepository {
  public abstract persistAndFlush(
    data: object | Reference<object> | Iterable<object | Reference<object>>
  ): Promise<void>
  public abstract findAll(): Promise<Table[]>
  public abstract findOneTable(id: string): Promise<Table | null>
}

export default TableRepository
