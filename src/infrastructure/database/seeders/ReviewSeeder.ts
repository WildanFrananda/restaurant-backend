import type { EntityManager } from "@mikro-orm/core"
import { Seeder } from "@mikro-orm/seeder"
import { faker } from "@faker-js/faker"
import Menu from "../../../domain/entities/menu.entity"
import Transaction from "../../../domain/entities/transaction.entity"
import User from "../../../domain/entities/user.entity"
import ReviewFactory from "./factory/review.factory"

class ReviewSeeder extends Seeder {
  public override async run(em: EntityManager): Promise<void> {
    const users = await em.find(User, {})
    const menus = await em.find(Menu, {})
    const transactions = await em.find(Transaction, {})

    const shuffledTransactions = faker.helpers.shuffle(transactions).slice(0, 80)

    for (const transaction of shuffledTransactions) {
      await new ReviewFactory(em).create(1, {
        user: faker.helpers.arrayElement(users),
        menu: faker.helpers.arrayElement(menus),
        transaction: transaction
      })
    }
  }
}

export default ReviewSeeder
