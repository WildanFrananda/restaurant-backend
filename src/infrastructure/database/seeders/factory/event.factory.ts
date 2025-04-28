import type { EntityData } from "@mikro-orm/core"
import { faker } from "@faker-js/faker"
import { Factory } from "@mikro-orm/seeder"
import AppEvent from "../../../../domain/entities/event.entity"

class EventFactory extends Factory<AppEvent> {
  model = AppEvent

  protected override definition(): EntityData<AppEvent> {
    const isPopup = faker.datatype.boolean()

    return {
      name: faker.company.catchPhrase(),
      description: faker.lorem.paragraph(),
      isPopup: isPopup,
      imageUrl: isPopup ? faker.image.url() : null
    }
  }
}

export default EventFactory
