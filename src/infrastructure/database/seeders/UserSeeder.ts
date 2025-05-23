import type { EntityManager } from "@mikro-orm/core"
import { Seeder } from "@mikro-orm/seeder"
import * as bcrypt from "bcrypt"
import UserRole from "../../../domain/enums/user-role.enum"
import UserProfileFactory from "./factory/user-profile.factory"
import UserFactory from "./factory/user.factory"
import User from "../../../domain/entities/user.entity"
import path from "path"
import fs from "fs"

class UserSeeder extends Seeder {
  public override async run(em: EntityManager): Promise<void> {
    const salt = await bcrypt.genSalt()
    const filePath = path.resolve(__dirname, "user.json")
    const rawData = fs.readFileSync(filePath, "utf-8")
    const users: Partial<User>[] = JSON.parse(rawData)

    for (const userData of users) {
      if (!userData.password) {
        throw new Error("User password is missing in seed data.")
      }
      const hashedPassword = await bcrypt.hash(userData.password, salt)

      if (
        !userData.email ||
        userData.isVerified === undefined ||
        !userData.role ||
        !userData.createdAt
      ) {
        throw new Error("Missing required user fields in seed data.")
      }

      const user = em.create(User, {
        ...userData,
        email: userData.email,
        isVerified: userData.isVerified,
        role: userData.role,
        createdAt: userData.createdAt,
        password: hashedPassword
      })
      em.persist(user)
    }

    await em.flush()
  }
}

export default UserSeeder
