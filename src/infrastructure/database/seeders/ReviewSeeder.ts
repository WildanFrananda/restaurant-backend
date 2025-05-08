import type { EntityManager } from "@mikro-orm/core"
import { Seeder } from "@mikro-orm/seeder"
import { faker } from "@faker-js/faker"
import Menu from "../../../domain/entities/menu.entity"
import User from "../../../domain/entities/user.entity"
import Booking from "../../../domain/entities/booking.entity"
import ReviewFactory from "./factory/review.factory"

class ReviewSeeder extends Seeder {
  public override async run(em: EntityManager): Promise<void> {
    const users = await em.find(User, {})
    const menus = await em.find(Menu, {})
    const booking = await em.find(Booking, {})

    const shuffledBooking = faker.helpers.shuffle(booking).slice(0, 80)

    for (const booking of shuffledBooking) {
      await new ReviewFactory(em).create(1, {
        user: faker.helpers.arrayElement(users),
        menu: faker.helpers.arrayElement(menus),
        booking: booking
      })
    }
  }
}

export default ReviewSeeder
