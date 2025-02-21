import type { EntityData } from "@mikro-orm/core"
import { faker } from "@faker-js/faker"
import { Factory } from "@mikro-orm/seeder"
import Chef from "../../../../domain/entities/chef.entity"
import ChefStatus from "../../../../domain/enums/chef-status.enum"

class ChefFactory extends Factory<Chef> {
  model = Chef

  protected override definition(): EntityData<Chef> {
    return {
      name: faker.person.fullName(),
      experience: faker.lorem.paragraph(),
      status: faker.helpers.arrayElement([
        ChefStatus.AVAILABLE,
        ChefStatus.BOOKED,
        ChefStatus.OFF_DUTY
      ]),
      imageUrl: faker.image.avatar()
    }
  }
}

export default ChefFactory
