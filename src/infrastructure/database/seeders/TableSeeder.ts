import type { EntityManager } from "@mikro-orm/core"
import { Seeder } from "@mikro-orm/seeder"
import TableFactory from "./factory/table.factory"
import path from "path"
import fs from "fs"
import Table from "../../../domain/entities/table.entity"

class TableSeeder extends Seeder {
  public override async run(em: EntityManager): Promise<void> {
    const filePath = path.resolve(__dirname, "table.json")
    const rawData = fs.readFileSync(filePath, "utf-8")
    const tables: Table[] = JSON.parse(rawData)

    for (const tablesData of tables) {
      const table = em.create(Table, tablesData)
      em.persist(table)
    }

    await em.flush()
  }
}

export default TableSeeder
