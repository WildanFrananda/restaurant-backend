import type { EntityManager } from "@mikro-orm/core"
import { Seeder } from "@mikro-orm/seeder"
import EventFactory from "./factory/event.factory"
import path from "path"
import fs from "fs"
import AppEvent from "../../../domain/entities/event.entity"

class EventSeeder extends Seeder {
  public override async run(em: EntityManager): Promise<void> {
    const filePath = path.resolve(__dirname, "event.json")
    const rawData = fs.readFileSync(filePath, "utf-8")
    const events: AppEvent[] = JSON.parse(rawData)

    for (const eventsData of events) {
      const event = em.create(AppEvent, eventsData)
      em.persist(event)
    }

    await em.flush()
  }
}

export default EventSeeder
