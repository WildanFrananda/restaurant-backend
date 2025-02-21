import { Entity, PrimaryKey, Property } from "@mikro-orm/core"
import { v4 } from "uuid"

@Entity()
class Event {
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

export default Event
