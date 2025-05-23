import type { EntityManager } from "@mikro-orm/core"
import { Seeder } from "@mikro-orm/seeder"
import path from "path"
import fs from "fs"
import UserProfile from "src/domain/entities/user-profile.entity"

class UserProfileSeeder extends Seeder {
  public override async run(em: EntityManager): Promise<void> {
    const filePath = path.resolve(__dirname, "profile.json")
    const rawData = fs.readFileSync(filePath, "utf-8")
    const profiles: UserProfile[]  = JSON.parse(rawData)

    for (const profilesData of profiles) {
      const profile = em.create(UserProfile, profilesData)
      em.persist(profile)
    }

    await em.flush()
  }
}

export default UserProfileSeeder
