import { Entity, PrimaryKey, Property } from "@mikro-orm/core"
import { v4 } from "uuid"

@Entity()
class AppEvent {
  @PrimaryKey({ type: "uuid" })
  id: string = v4()

  @Property()
  name: string

  @Property({ type: "text" })
  description: string

  @Property()
  isPopup: boolean

  @Property({ nullable: true })
  imageUrl?: string
}

export default AppEvent
