import type { EntityData } from "@mikro-orm/core"
import { faker } from "@faker-js/faker"
import { Factory } from "@mikro-orm/seeder"
import Category from "../../../../domain/entities/category.entity"

class CategoryFactory extends Factory<Category> {
  model = Category

  protected override definition(): EntityData<Category> {
    return {
      name: faker.commerce.department(),
      description: faker.commerce.productDescription(),
      imageUrl: faker.image.url()
    }
  }
}

export default CategoryFactory
