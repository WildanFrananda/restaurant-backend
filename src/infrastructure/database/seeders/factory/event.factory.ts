import type { EntityData } from "@mikro-orm/core"
import { faker } from "@faker-js/faker"
import { Factory } from "@mikro-orm/seeder"
import Event from "../../../../domain/entities/event.entity"

class EventFactory extends Factory<Event> {
  model = Event

  protected override definition(): EntityData<Event> {
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
