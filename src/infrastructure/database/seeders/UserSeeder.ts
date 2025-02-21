import type { EntityManager } from "@mikro-orm/core"
import { Seeder } from "@mikro-orm/seeder"
import UserFactory from "./factory/user.factory"
import UserProfileFactory from "./factory/user-profile.factory"

class UserSeeder extends Seeder {
  public override async run(em: EntityManager): Promise<void> {
    const users = await new UserFactory(em).create(50)

    for (const user of users) {
      await new UserProfileFactory(em).createOne({ user: user })
    }
  }
}

export default UserSeeder
