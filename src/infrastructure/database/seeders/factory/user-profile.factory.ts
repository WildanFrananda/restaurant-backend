import type { EntityData } from "@mikro-orm/core"
import { faker } from "@faker-js/faker"
import { Factory } from "@mikro-orm/seeder"
import UserProfile from "../../../../domain/entities/user-profile.entity"

class UserProfileFactory extends Factory<UserProfile> {
  model = UserProfile

  protected override definition(): EntityData<UserProfile> {
    return {
      userId: faker.string.uuid(),
      name: faker.person.fullName(),
      imageUrl: faker.image.avatar(),
      address: {
        street: faker.location.street(),
        city: faker.location.city(),
        state: faker.location.state(),
        country: faker.location.country(),
        zipCode: faker.location.zipCode()
      },
      walletBallance: parseFloat(faker.finance.amount({ max: 100000 })),
      updateAt: faker.date.recent()
    }
  }
}

export default UserProfileFactory
