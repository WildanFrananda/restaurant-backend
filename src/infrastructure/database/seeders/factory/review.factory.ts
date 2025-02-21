import type { EntityData } from "@mikro-orm/core"
import { faker } from "@faker-js/faker"
import { Factory } from "@mikro-orm/seeder"
import Review from "../../../../domain/entities/review.entity"

class ReviewFactory extends Factory<Review> {
  model = Review

  protected override definition(): EntityData<Review> {
    return {
      rating: faker.number.int({ min: 1, max: 5 }),
      comment: Math.random() > 0.3 ? faker.lorem.paragraph() : null,
      createdAt: faker.date.recent(),
      updatedAt: faker.date.recent()
    }
  }
}

export default ReviewFactory
