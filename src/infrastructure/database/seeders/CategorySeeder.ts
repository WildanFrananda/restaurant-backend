import type { EntityManager } from "@mikro-orm/core"
import { Seeder } from "@mikro-orm/seeder"
import CategoryFactory from "./factory/category.factory"
import path from "path"
import fs from "fs"
import Category from "src/domain/entities/category.entity"

class CategorySeeder extends Seeder {
  public override async run(em: EntityManager): Promise<void> {
    const filePath = path.resolve(__dirname, "category.json")
    const rawData = fs.readFileSync(filePath, "utf-8")
    const categories: Category[] = JSON.parse(rawData)

    for (const categoriesData of categories) {
      const category = em.create(Category, categoriesData)
      em.persist(category)
    }

    await em.flush()
  }
}

export default CategorySeeder
