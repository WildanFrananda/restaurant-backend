import { Collection, Entity, OneToMany, PrimaryKey, Property } from "@mikro-orm/core"
import { v4 } from "uuid"
import Menu from "./menu.entity"

@Entity()
class Category {
  @PrimaryKey({ type: "uuid" })
  id: string = v4()

  @Property()
  name: string

  @Property({ type: "text" })
  description: string

  @Property()
  imageUrl: string

  @OneToMany(() => Menu, (menu) => menu.category)
  menus = new Collection<Menu>(this)
}

export default Category
