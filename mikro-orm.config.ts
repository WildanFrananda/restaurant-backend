import { Options } from "@mikro-orm/core"
import { Migrator } from "@mikro-orm/migrations"
import { SeedManager } from "@mikro-orm/seeder"
import { PostgreSqlDriver } from "@mikro-orm/postgresql"
import { TsMorphMetadataProvider } from "@mikro-orm/reflection"
import { config as dotEnvConfig } from "dotenv"

dotEnvConfig()

const config: Options = {
  driver: PostgreSqlDriver,
  entities: ["./dist/src/domain/entities/*.entity.js"],
  entitiesTs: ["./src/domain/entities/*.entity.ts"],
  extensions: [Migrator, SeedManager],
  migrations: {
    path: "./dist/src/infrastructure/database/migrations",
    pathTs: "./src/infrastructure/database/migrations"
  },
  seeder: {
    path: "./dist/src/infrastructure/database/seeders",
    pathTs: "./src/infrastructure/database/seeders",
    emit: "ts",
    defaultSeeder: "DatabaseSeeder"
  },
  dbName: process.env.DATABASE_NAME,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  host: process.env.DATABASE_HOST,
  port: process.env.DATABASE_PORT ? parseInt(process.env.DATABASE_PORT, 10) : undefined,
  metadataProvider: TsMorphMetadataProvider,
  debug: true
}

export default config
