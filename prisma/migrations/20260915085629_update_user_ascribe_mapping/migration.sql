/*
  Warnings:

  - The values [contractor] on the enum `user_role` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `password_hash` on the `users` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[phone]` on the table `users` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[ascribe_resident_id]` on the table `users` will be added. If there are existing duplicate values, this will fail.
  - Made the column `phone` on table `users` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "user_role_new" AS ENUM ('resident', 'guard', 'admin');
ALTER TABLE "users" ALTER COLUMN "role" TYPE "user_role_new" USING ("role"::text::"user_role_new");
ALTER TYPE "user_role" RENAME TO "user_role_old";
ALTER TYPE "user_role_new" RENAME TO "user_role";
DROP TYPE "public"."user_role_old";
COMMIT;

-- DropIndex
DROP INDEX "visitor_passes_manual_code_key";

-- AlterTable
ALTER TABLE "users" DROP COLUMN "password_hash",
ADD COLUMN     "ascribe_resident_id" INTEGER,
ALTER COLUMN "phone" SET NOT NULL;

-- AlterTable
ALTER TABLE "visitor_passes" ALTER COLUMN "manual_code" SET DATA TYPE VARCHAR(12);

-- AlterTable
ALTER TABLE "visitors" ADD COLUMN     "id_number" VARCHAR(50);

-- CreateIndex
CREATE UNIQUE INDEX "users_phone_key" ON "users"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "users_ascribe_resident_id_key" ON "users"("ascribe_resident_id");
