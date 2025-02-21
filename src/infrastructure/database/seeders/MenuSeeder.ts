import type { EntityManager } from "@mikro-orm/core"
import { Seeder } from "@mikro-orm/seeder"
import { faker } from "@faker-js/faker"
import Category from "../../../domain/entities/category.entity"
import MenuFactory from "./factory/menu.factory"

class MenuSeeder extends Seeder {
  public override async run(em: EntityManager): Promise<void> {
    const categories = await em.find(Category, {})

    await new MenuFactory(em).create(30, {
      category: faker.helpers.arrayElement(categories)
    })
  }
}

export default MenuSeeder
