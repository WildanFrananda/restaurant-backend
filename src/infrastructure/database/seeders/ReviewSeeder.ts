import type { EntityManager } from "@mikro-orm/core"
import { Seeder } from "@mikro-orm/seeder"
import { faker } from "@faker-js/faker"
import Menu from "../../../domain/entities/menu.entity"
import User from "../../../domain/entities/user.entity"
import Booking from "../../../domain/entities/booking.entity"
import ReviewFactory from "./factory/review.factory"
import path from "path"
import fs from "fs"
import Review from "src/domain/entities/review.entity"

class ReviewSeeder extends Seeder {
  public override async run(em: EntityManager): Promise<void> {
    const filePath = path.resolve(__dirname, "review.json")
    const rawData = fs.readFileSync(filePath, "utf-8")
    const parsedData: { data: Review[] } = JSON.parse(rawData)
    const reviews: Review[] = parsedData.data

    for (const reviewsData of reviews) {
      const review = em.create(Review, reviewsData)
      em.persist(review)
    }

    await em.flush()
  }
}

export default ReviewSeeder
