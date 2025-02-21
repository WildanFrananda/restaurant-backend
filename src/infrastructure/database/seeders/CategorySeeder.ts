import type { EntityManager } from "@mikro-orm/core"
import { Seeder } from "@mikro-orm/seeder"
import CategoryFactory from "./factory/category.factory"

class CategorySeeder extends Seeder {
  public override async run(em: EntityManager): Promise<void> {
    await new CategoryFactory(em).create(5)
  }
}

export default CategorySeeder
