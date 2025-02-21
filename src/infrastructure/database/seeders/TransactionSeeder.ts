import type { EntityManager } from "@mikro-orm/core"
import { Seeder } from "@mikro-orm/seeder"
import { faker } from "@faker-js/faker"
import Booking from "../../../domain/entities/booking.entity"
import User from "../../../domain/entities/user.entity"
import TransactionFactory from "./factory/transaction.factory"

class TransactionSeeder extends Seeder {
  public override async run(em: EntityManager): Promise<void> {
    const users = await em.find(User, {})
    const bookings = await em.find(Booking, {})

    await new TransactionFactory(em).create(200, {
      user: faker.helpers.arrayElement(users),
      booking: Math.random() > 0.5 ? faker.helpers.arrayElement(bookings) : null
    })
  }
}

export default TransactionSeeder
