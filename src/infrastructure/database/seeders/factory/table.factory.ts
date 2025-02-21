import type { EntityData } from "@mikro-orm/core"
import { faker } from "@faker-js/faker"
import { Factory } from "@mikro-orm/seeder"
import Table from "../../../../domain/entities/table.entity"
import TableStatus from "../../../../domain/enums/table-status.enum"

class TableFactory extends Factory<Table> {
  model = Table

  protected override definition(): EntityData<Table> {
    return {
      tableNumber: faker.string.alphanumeric(3).toUpperCase(),
      capacity: faker.number.int({ min: 2, max: 12 }),
      status: faker.helpers.arrayElement([TableStatus.AVAILABLE, TableStatus.RESERVED])
    }
  }
}

export default TableFactory
