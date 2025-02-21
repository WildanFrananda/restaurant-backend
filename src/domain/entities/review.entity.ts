import { Entity, ManyToOne, OneToOne, PrimaryKey, Property } from "@mikro-orm/core"
import { v4 } from "uuid"
import User from "./user.entity"
import Menu from "./menu.entity"
import Transaction from "./transaction.entity"

@Entity()
class Review {
  @PrimaryKey({ type: "uuid" })
  id: string = v4()

  @ManyToOne(() => User)
  user: User

  @ManyToOne(() => Menu)
  menu: Menu

  @OneToOne(() => Transaction)
  transaction: Transaction

  @Property({ type: "numeric" })
  rating: number

  @Property({ type: "text", nullable: true })
  comment?: string

  @Property()
  createdAt: Date = new Date()

  @Property({ onUpdate: () => new Date() })
  updatedAt: Date = new Date()
}

export default Review
