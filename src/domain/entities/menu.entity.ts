import {
  Collection,
  Entity,
  Enum,
  ManyToOne,
  OneToMany,
  PrimaryKey,
  Property
} from "@mikro-orm/core"
import { v4 } from "uuid"
import Category from "./category.entity"
import MenuStatus from "../enums/menu-status.enum"
import Review from "./review.entity"

@Entity()
class Menu {
  @PrimaryKey({ type: "uuid" })
  id: string = v4()

  @Property()
  name: string

  @Property({ type: "text", nullable: true })
  description?: string

  @Property({ type: "decimal", precision: 10, scale: 2 })
  price: number

  @ManyToOne(() => Category)
  category: Category

  @Property()
  isTopWeek: boolean = false

  @Enum(() => MenuStatus)
  status: MenuStatus

  @Property()
  imageUrl: string

  @OneToMany(() => Review, (review) => review.menu)
  reviews = new Collection<Review>(this)
}

export default Menu
