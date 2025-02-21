import type { EntityData } from "@mikro-orm/core"
import { faker } from "@faker-js/faker"
import { Factory } from "@mikro-orm/seeder"
import Booking from "../../../../domain/entities/booking.entity"
import BookingStatus from "../../../../domain/enums/booking-status.enum"
import BookingType from "../../../../domain/enums/booking-type.enum"
import ChefLocation from "../../../../domain/enums/chef-location.enum"

class BookingFactory extends Factory<Booking> {
  model = Booking

  protected override definition(): EntityData<Booking> {
    const type = faker.helpers.arrayElement(["restaurant", "home dine in"])

    return {
      type: faker.helpers.arrayElement([BookingType.HOME_DINE_IN, BookingType.RESTAURANT]),
      schedule: faker.date.future(),
      location: type === "home dine in" ? faker.location.streetAddress() : null,
      status: BookingStatus.CONFIRMED,
      chefLocation: faker.helpers.arrayElement([
        ChefLocation.EN_ROUTE,
        ChefLocation.ARRIVED,
        ChefLocation.COOKING,
        ChefLocation.COMPLETED,
        null
      ])
    }
  }
}

export default BookingFactory
