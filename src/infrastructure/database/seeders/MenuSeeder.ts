import type { EntityManager } from "@mikro-orm/core"
import { Seeder } from "@mikro-orm/seeder"
import { faker } from "@faker-js/faker"
import Category from "../../../domain/entities/category.entity"
import MenuFactory from "./factory/menu.factory"
import path from "path"
import fs from "fs"
import Menu from "../../../domain/entities/menu.entity"

class MenuSeeder extends Seeder {
  public override async run(em: EntityManager): Promise<void> {
    const filePath = path.resolve(__dirname, "menu.json")
    const rawData = fs.readFileSync(filePath, "utf-8")
    const parsedData: { data: Menu[] } = JSON.parse(rawData)
    const menus: Menu[] = parsedData.data

    for (const menusData of menus) {
      const menu = em.create(Menu, menusData)
      em.persist(menu)
    }

    await em.flush()
  }
}

export default MenuSeeder
