import { Entity, JsonType, OneToOne, PrimaryKey, Property } from "@mikro-orm/core"
import User from "./user.entity"

@Entity()
class UserProfile {
  @PrimaryKey()
  @Property({ fieldName: "user_id" })
  userId: string

  @OneToOne(() => User, (user) => user.profile, {
    owner: true,
    fieldName: "user_ref"
  })
  user: User

  @Property()
  name: string

  @Property()
  imageUrl: string

  @Property({ type: JsonType })
  address: unknown

  @Property({ type: "decimal", precision: 10, scale: 2 })
  walletBallance: number

  @Property({ onUpdate: () => new Date() })
  updateAt: Date = new Date()
}

export default UserProfile
