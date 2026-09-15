/*
  Warnings:

  - You are about to drop the column `email` on the `users` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[ascribe_house_id]` on the table `apartments` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[property_id,unit_number,block]` on the table `apartments` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `ascribe_house_id` to the `apartments` table without a default value. This is not possible if the table is not empty.
  - Added the required column `property_id` to the `apartments` table without a default value. This is not possible if the table is not empty.
  - Made the column `resident_id` on table `apartments` required. This step will fail if there are existing NULL values in that column.
  - Made the column `ascribe_resident_id` on table `users` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "apartments" DROP CONSTRAINT "fk_apartment_resident";

-- DropIndex
DROP INDEX "apartments_resident_id_key";

-- DropIndex
DROP INDEX "unique_unit";

-- DropIndex
DROP INDEX "idx_users_email";

-- DropIndex
DROP INDEX "users_email_key";

-- AlterTable
ALTER TABLE "apartments" ADD COLUMN     "ascribe_house_id" INTEGER NOT NULL,
ADD COLUMN     "property_id" UUID NOT NULL,
ALTER COLUMN "resident_id" SET NOT NULL;

-- AlterTable
ALTER TABLE "users" DROP COLUMN "email",
ALTER COLUMN "ascribe_resident_id" SET NOT NULL;

-- CreateTable
CREATE TABLE "properties" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "ascribe_property_id" INTEGER NOT NULL,
    "name" VARCHAR(150) NOT NULL,
    "code" VARCHAR(100),
    "phone" VARCHAR(20),
    "email" VARCHAR(255),
    "location" VARCHAR(255),
    "city" VARCHAR(100),
    "country" VARCHAR(100),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "properties_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "properties_ascribe_property_id_key" ON "properties"("ascribe_property_id");

-- CreateIndex
CREATE UNIQUE INDEX "apartments_ascribe_house_id_key" ON "apartments"("ascribe_house_id");

-- CreateIndex
CREATE INDEX "idx_apartments_property" ON "apartments"("property_id");

-- CreateIndex
CREATE INDEX "idx_apartments_resident" ON "apartments"("resident_id");

-- CreateIndex
CREATE UNIQUE INDEX "unique_property_unit" ON "apartments"("property_id", "unit_number", "block");

-- CreateIndex
CREATE INDEX "idx_users_ascribe_resident" ON "users"("ascribe_resident_id");

-- CreateIndex
CREATE INDEX "idx_pass_apartment" ON "visitor_passes"("apartment_id");

-- RenameForeignKey
ALTER TABLE "visit_logs" RENAME CONSTRAINT "fk_log_guard" TO "visit_logs_guard_id_fkey";

-- RenameForeignKey
ALTER TABLE "visit_logs" RENAME CONSTRAINT "fk_log_pass" TO "visit_logs_visitor_pass_id_fkey";

-- RenameForeignKey
ALTER TABLE "visitor_passes" RENAME CONSTRAINT "fk_pass_apartment" TO "visitor_passes_apartment_id_fkey";

-- RenameForeignKey
ALTER TABLE "visitor_passes" RENAME CONSTRAINT "fk_pass_resident" TO "visitor_passes_resident_id_fkey";

-- RenameForeignKey
ALTER TABLE "visitor_passes" RENAME CONSTRAINT "fk_pass_visitor" TO "visitor_passes_visitor_id_fkey";

-- AddForeignKey
ALTER TABLE "apartments" ADD CONSTRAINT "apartments_property_id_fkey" FOREIGN KEY ("property_id") REFERENCES "properties"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "apartments" ADD CONSTRAINT "apartments_resident_id_fkey" FOREIGN KEY ("resident_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;
