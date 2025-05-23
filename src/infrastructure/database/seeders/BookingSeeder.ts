import type { EntityManager } from "@mikro-orm/core"
import { Seeder } from "@mikro-orm/seeder"
import { faker } from "@faker-js/faker"
import Chef from "../../../domain/entities/chef.entity"
import Menu from "../../../domain/entities/menu.entity"
import Table from "../../../domain/entities/table.entity"
import User from "../../../domain/entities/user.entity"
import BookingFactory from "./factory/booking.factory"
import path from "path"
import fs from "fs"
import Booking from "../../../domain/entities/booking.entity"

class BookingSeeder extends Seeder {
  public override async run(em: EntityManager): Promise<void> {
    const filePath = path.resolve(__dirname, "bookings.json")
    const rawData = fs.readFileSync(filePath, "utf-8")
    const parsedData: { data: Booking[] } = JSON.parse(rawData)
    const bookings: Booking[] = parsedData.data

    for (const bookingsData of bookings) {
      const booking = em.create(Booking, bookingsData)
      em.persist(booking)
    }

    await em.flush()
  }
}

export default BookingSeeder
