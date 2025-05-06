import type { EntityManager } from "@mikro-orm/core"
import { Seeder } from "@mikro-orm/seeder"
import * as bcrypt from "bcrypt"
import UserRole from "../../../domain/enums/user-role.enum"
import UserProfileFactory from "./factory/user-profile.factory"
import UserFactory from "./factory/user.factory"

class UserSeeder extends Seeder {
  public override async run(em: EntityManager): Promise<void> {
    const salt = await bcrypt.genSalt()
    const hashedAdminPassword = await bcrypt.hash("admin", salt)
    const admin = await new UserFactory(em).createOne({
      email: "wildanfrananda@fullstack.dev",
      password: hashedAdminPassword,
      role: UserRole.ADMIN,
      isVerified: true
    })

    await new UserProfileFactory(em).createOne({ name: "Wildan Frananda", user: admin })

    const hashedStaffPassword = await bcrypt.hash("staff", salt)
    const staff = await new UserFactory(em).createOne({
      email: "chef@staff.com",
      password: hashedStaffPassword,
      role: UserRole.STAFF
    })

    await new UserProfileFactory(em).createOne({ user: staff })

    const users = await new UserFactory(em).create(50)

    for (const user of users) {
      if (user.password) {
        const hashedUserPassword = await bcrypt.hash(user.password, salt)
        user.password = hashedUserPassword
      }

      await new UserProfileFactory(em).createOne({ user: user })
    }
  }
}

export default UserSeeder
