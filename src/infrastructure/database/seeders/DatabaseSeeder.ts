import type { EntityManager } from "@mikro-orm/core"
import { Seeder } from "@mikro-orm/seeder"
import UserSeeder from "./UserSeeder"
import CategorySeeder from "./CategorySeeder"
import ChefSeeder from "./ChefSeeder"
import TableSeeder from "./TableSeeder"
import EventSeeder from "./EventSeeder"
import MenuSeeder from "./MenuSeeder"
import BookingSeeder from "./BookingSeeder"
import TransactionSeeder from "./TransactionSeeder"
import ReviewSeeder from "./ReviewSeeder"
import UserProfileSeeder from "./UserProfileSeeder"

class DatabaseSeeder extends Seeder {
  public override async run(em: EntityManager): Promise<void> {
    return this.call(em, [
      UserSeeder,
      CategorySeeder,
      ChefSeeder,
      TableSeeder,
      EventSeeder,
      MenuSeeder,
      BookingSeeder,
      TransactionSeeder,
      ReviewSeeder,
      UserProfileSeeder
    ])
  }
}

export { DatabaseSeeder }
