import type { EntityManager } from "@mikro-orm/core"
import { Seeder } from "@mikro-orm/seeder"
import ChefFactory from "./factory/chef.factory"

class ChefSeeder extends Seeder {
  public override async run(em: EntityManager): Promise<void> {
    await new ChefFactory(em).create(10)
  }
}

export default ChefSeeder
