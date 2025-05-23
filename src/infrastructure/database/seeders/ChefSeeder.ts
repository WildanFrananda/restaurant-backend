import type { EntityManager } from "@mikro-orm/core"
import { Seeder } from "@mikro-orm/seeder"
import ChefFactory from "./factory/chef.factory"
import path from "path"
import fs from "fs"
import Chef from "../../../domain/entities/chef.entity"

class ChefSeeder extends Seeder {
  public override async run(em: EntityManager): Promise<void> {
    const filePath = path.resolve(__dirname, "chef.json")
    const rawData = fs.readFileSync(filePath, "utf-8")
    const chefs: Chef[] = JSON.parse(rawData)

    for (const chefsData of chefs) {
      const chef = em.create(Chef, chefsData)
      em.persist(chef)
    }

    await em.flush()
  }
}

export default ChefSeeder
