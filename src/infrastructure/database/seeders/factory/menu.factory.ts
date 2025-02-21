import type { EntityData } from "@mikro-orm/core"
import { faker } from "@faker-js/faker"
import { Factory } from "@mikro-orm/seeder"
import Menu from "../../../../domain/entities/menu.entity"
import MenuStatus from "../../../../domain/enums/menu-status.enum"

class MenuFactory extends Factory<Menu> {
  model = Menu

  protected override definition(): EntityData<Menu> {
    return {
      name: faker.commerce.productName(),
      description: faker.commerce.productDescription(),
      price: parseFloat(faker.commerce.price({ min: 10, max: 200 })),
      isTopWeek: faker.datatype.boolean(),
      status: faker.helpers.arrayElement([MenuStatus.AVAILABLE, MenuStatus.SOLD_OUT]),
      imageUrl: faker.image.url()
    }
  }
}

export default MenuFactory
