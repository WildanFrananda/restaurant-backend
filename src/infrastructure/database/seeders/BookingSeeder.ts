import type { EntityManager } from "@mikro-orm/core"
import { Seeder } from "@mikro-orm/seeder"
import { faker } from "@faker-js/faker"
import Chef from "../../../domain/entities/chef.entity"
import Menu from "../../../domain/entities/menu.entity"
import Table from "../../../domain/entities/table.entity"
import User from "../../../domain/entities/user.entity"
import BookingFactory from "./factory/booking.factory"

class BookingSeeder extends Seeder {
  public override async run(em: EntityManager): Promise<void> {
    const users = await em.find(User, {})
    const menus = await em.find(Menu, {})
    const chefs = await em.find(Chef, {})
    const tables = await em.find(Table, {})

    await new BookingFactory(em).create(100, {
      user: faker.helpers.arrayElement(users),
      menu: Math.random() > 0.2 ? faker.helpers.arrayElement(menus) : null,
      chef: Math.random() > 0.3 ? faker.helpers.arrayElement(chefs) : null,
      table: Math.random() > 0.5 ? faker.helpers.arrayElement(tables) : null
    })
  }
}

export default BookingSeeder
