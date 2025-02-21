import type { EntityManager } from "@mikro-orm/core"
import { Seeder } from "@mikro-orm/seeder"
import EventFactory from "./factory/event.factory"

class EventSeeder extends Seeder {
  public override async run(em: EntityManager): Promise<void> {
    await new EventFactory(em).create(3)
  }
}

export default EventSeeder
