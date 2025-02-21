import type { EntityManager } from "@mikro-orm/core"
import { Seeder } from "@mikro-orm/seeder"
import TableFactory from "./factory/table.factory"

class TableSeeder extends Seeder {
  public override async run(em: EntityManager): Promise<void> {
    await new TableFactory(em).create(20)
  }
}

export default TableSeeder
