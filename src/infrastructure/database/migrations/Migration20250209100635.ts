/* eslint-disable max-len */
import { Migration } from "@mikro-orm/migrations"

class Migration20250209100635 extends Migration {
  public override async up(): Promise<void> {
    this.addSql(
      `CREATE TABLE "category" (
        "id" UUID NOT NULL,
        "name" VARCHAR(255) NOT NULL,
        "description" TEXT NOT NULL,
        "image_url" VARCHAR(255) NOT NULL,
        CONSTRAINT "category_pkey" PRIMARY KEY ("id")
      );`
    )

    this.addSql(
      `CREATE TABLE "chef" (
        "id" UUID NOT NULL,
        "name" VARCHAR(255) NOT NULL,
        "experience" TEXT NOT NULL,
        "status" TEXT CHECK ("status" IN ('available', 'booked', 'off duty')) NOT NULL,
        "image_url" VARCHAR(255) NOT NULL,
        CONSTRAINT "chef_pkey" PRIMARY KEY ("id")
      );`
    )

    this.addSql(
      `CREATE TABLE "app_event" (
        "id" UUID NOT NULL,
        "name" VARCHAR(255) NOT NULL,
        "description" TEXT NOT NULL,
        "is_popup" BOOLEAN NOT NULL,
        "image_url" VARCHAR(255) NULL,
        CONSTRAINT "app_event_pkey" PRIMARY KEY ("id")
      );`
    )

    this.addSql(
      `CREATE TABLE "menu" (
        "id" UUID NOT NULL,
        "name" VARCHAR(255) NOT NULL,
        "description" TEXT NULL,
        "price" NUMERIC(10,2) NOT NULL,
        "category_id" UUID NOT NULL,
        "is_top_week" BOOLEAN NOT NULL DEFAULT FALSE,
        "status" TEXT CHECK ("status" IN ('available', 'sold out')) NOT NULL,
        "image_url" VARCHAR(255) NOT NULL,
        CONSTRAINT "menu_pkey" PRIMARY KEY ("id")
      );`
    )

    this.addSql(
      `CREATE TABLE "table" (
        "id" UUID NOT NULL,
        "table_number" VARCHAR(255) NOT NULL,
        "capacity" INT NOT NULL,
        "status" TEXT CHECK ("status" IN ('available', 'reserved')) NOT NULL,
        CONSTRAINT "table_pkey" PRIMARY KEY ("id")
      );`
    )

    this.addSql(
      `CREATE TABLE "user" (
        "id" UUID NOT NULL,
        "email" VARCHAR(255) NOT NULL,
        "password" VARCHAR(255) NULL,
        "google_id" VARCHAR(255) NULL,
        "is_verified" BOOLEAN NOT NULL,
        "role" TEXT CHECK ("role" IN ('admin', 'staff', 'user')) NOT NULL,
        "created_at" TIMESTAMPTZ NOT NULL,
        CONSTRAINT "user_pkey" PRIMARY KEY ("id"),
        CONSTRAINT "user_email_unique" UNIQUE ("email")
      );`
    )

    this.addSql(
      `CREATE TABLE "booking" (
        "id" UUID NOT NULL,
        "user_id" UUID NOT NULL,
        "type" TEXT CHECK ("type" IN ('restaurant', 'home dine in')) NOT NULL,
        "schedule" TIMESTAMPTZ NOT NULL,
        "location" VARCHAR(255) NULL,
        "status" TEXT CHECK ("status" IN ('pending', 'confirmed', 'cancelled')) NOT NULL,
        "chef_location" TEXT CHECK ("chef_location" IN ('en route', 'arrived', 'searching', 'cooking', 'completed')) NULL,
        "menu_id" UUID NULL,
        "total_amount" NUMERIC(10,2) NOT NULL DEFAULT 0,
        "chef_id" UUID NULL,
        "table_id" UUID NULL,
        "created_at" TIMESTAMPTZ NOT NULL,
        CONSTRAINT "booking_pkey" PRIMARY KEY ("id")
      );`
    )

    this.addSql(`
      CREATE TABLE "booking_menu" (
        "id" UUID NOT NULL,
        "booking_id" UUID NOT NULL,
        "menu_id" UUID NOT NULL,
        "quantity" INT NOT NULL,
        "price_at_booking" NUMERIC(10,2) NOT NULL,
        CONSTRAINT "booking_menu_pkey" PRIMARY KEY ("id")
      );
    `)

    this.addSql(
      `CREATE TABLE "transaction" (
        "id" UUID NOT NULL,
        "user_id" UUID NOT NULL,
        "amount" NUMERIC(10,2) NOT NULL,
        "type" TEXT CHECK ("type" IN ('top_up', 'payment', 'refund', 'canceled')) NOT NULL,
        "status" TEXT CHECK ("status" IN ('pending', 'success', 'failed', 'retrying')) NOT NULL,
        "failure_reason" TEXT CHECK ("failure_reason" IN ('insufficient_balance', 'payment_timeout', 'system_error', 'booking_invalid')) NULL,
        "notes" TEXT NULL,
        "retry_count" INT NOT NULL DEFAULT 0,
        "booking_id" UUID NULL,
        "created_at" TIMESTAMPTZ NOT NULL,
        "updated_at" TIMESTAMPTZ NOT NULL,
        CONSTRAINT "transaction_pkey" PRIMARY KEY ("id")
      );`
    )

    this.addSql(
      `CREATE TABLE "review" (
        "id" UUID NOT NULL,
        "user_id" UUID NOT NULL,
        "menu_id" UUID NOT NULL,
        "transaction_id" UUID NOT NULL,
        "rating" NUMERIC(10,0) NOT NULL,
        "comment" TEXT NULL,
        "created_at" TIMESTAMPTZ NOT NULL,
        "updated_at" TIMESTAMPTZ NOT NULL,
        CONSTRAINT "review_pkey" PRIMARY KEY ("id"),
        CONSTRAINT "review_transaction_id_unique" UNIQUE ("transaction_id")
      );`
    )

    this.addSql(
      `CREATE TABLE "user_profile" (
        "user_id" VARCHAR(255) NOT NULL,
        "user_ref" UUID NOT NULL,
        "name" VARCHAR(255) NOT NULL,
        "image_url" VARCHAR(255) NOT NULL,
        "address" JSONB NOT NULL,
        "wallet_ballance" NUMERIC(10,2) NOT NULL,
        "update_at" TIMESTAMPTZ NOT NULL,
        CONSTRAINT "user_profile_pkey" PRIMARY KEY ("user_id"),
        CONSTRAINT "user_profile_user_ref_unique" UNIQUE ("user_ref")
      );`
    )

    this.addSql(
      `ALTER TABLE "menu" ADD CONSTRAINT "menu_category_id_foreign" FOREIGN KEY ("category_id") REFERENCES "category" ("id") ON UPDATE CASCADE;`
    )

    this.addSql(
      `ALTER TABLE "booking" ADD CONSTRAINT "booking_user_id_foreign" FOREIGN KEY ("user_id") REFERENCES "user" ("id") ON UPDATE CASCADE;`
    )

    this.addSql(
      `ALTER TABLE "booking" ADD CONSTRAINT "booking_menu_id_foreign" FOREIGN KEY ("menu_id") REFERENCES "menu" ("id") ON UPDATE CASCADE ON DELETE SET NULL;`
    )

    this.addSql(
      `ALTER TABLE "booking" ADD CONSTRAINT "booking_chef_id_foreign" FOREIGN KEY ("chef_id") REFERENCES "chef" ("id") ON UPDATE CASCADE ON DELETE SET NULL;`
    )

    this.addSql(
      `ALTER TABLE "booking" ADD CONSTRAINT "booking_table_id_foreign" FOREIGN KEY ("table_id") REFERENCES "table" ("id") ON UPDATE CASCADE ON DELETE SET NULL;`
    )

    this.addSql(`
      ALTER TABLE "booking_menu"
      ADD CONSTRAINT "booking_menu_booking_id_foreign"
      FOREIGN KEY ("booking_id") REFERENCES "booking" ("id") ON UPDATE CASCADE ON DELETE CASCADE;
    `)

    this.addSql(`
      ALTER TABLE "booking_menu"
      ADD CONSTRAINT "booking_menu_menu_id_foreign"
      FOREIGN KEY ("menu_id") REFERENCES "menu" ("id") ON UPDATE CASCADE ON DELETE CASCADE;
    `)

    this.addSql(
      `ALTER TABLE "transaction" ADD CONSTRAINT "transaction_user_id_foreign" FOREIGN KEY ("user_id") REFERENCES "user" ("id") ON UPDATE CASCADE;`
    )

    this.addSql(
      `ALTER TABLE "transaction" ADD CONSTRAINT "transaction_booking_id_foreign" FOREIGN KEY ("booking_id") REFERENCES "booking" ("id") ON UPDATE CASCADE ON DELETE SET NULL`
    )

    this.addSql(
      `ALTER TABLE "review" ADD CONSTRAINT "review_user_id_foreign" FOREIGN KEY ("user_id") REFERENCES "user" ("id") ON UPDATE CASCADE;`
    )

    this.addSql(
      `ALTER TABLE "review" ADD CONSTRAINT "review_menu_id_foreign" FOREIGN KEY ("menu_id") REFERENCES "menu" ("id") ON UPDATE CASCADE;`
    )

    this.addSql(
      `ALTER TABLE "review" ADD CONSTRAINT "review_transaction_id_foreign" FOREIGN KEY ("transaction_id") REFERENCES "transaction" ("id") ON UPDATE CASCADE;`
    )

    this.addSql(
      `ALTER TABLE "user_profile" ADD CONSTRAINT "user_profile_user_ref_foreign" FOREIGN KEY ("user_ref") REFERENCES "user" ("id") ON UPDATE CASCADE;`
    )

    return Promise.resolve()
  }

  public override async down(): Promise<void> {
    this.addSql(`
      DROP TABLE IF EXISTS "review";
      DROP TABLE IF EXISTS "app_event";
      DROP TABLE IF EXISTS "event";
      DROP TABLE IF EXISTS "transaction";
      DROP TABLE IF EXISTS "booking";
      DROP TABLE IF EXISTS "table";
      DROP TABLE IF EXISTS "booking_menu";
      DROP TABLE IF EXISTS "chef";
      DROP TABLE IF EXISTS "menu";
      DROP TABLE IF EXISTS "category";
      DROP TABLE IF EXISTS "user_profile";
      DROP TABLE IF EXISTS "user";
    `)

    return Promise.resolve()
  }
}

export { Migration20250209100635 }
