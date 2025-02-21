import type { EntityData } from "@mikro-orm/core"
import { faker } from "@faker-js/faker"
import { Factory } from "@mikro-orm/seeder"
import User from "../../../../domain/entities/user.entity"
import UserRole from "../../../../domain/enums/user-role.enum"

class UserFactory extends Factory<User> {
  model = User

  protected override definition(): EntityData<User> {
    return {
      email: faker.internet.email(),
      password: faker.internet.password(),
      googleId: Math.random() > 0.5 ? faker.string.uuid() : null,
      isVerified: faker.datatype.boolean(),
      role: UserRole.USER,
      createdAt: faker.date.past()
    }
  }
}

export default UserFactory
