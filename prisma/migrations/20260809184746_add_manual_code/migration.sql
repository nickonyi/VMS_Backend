/*
  Warnings:

  - You are about to drop the column `notes` on the `visitor_passes` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[manual_code]` on the table `visitor_passes` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "visitor_passes" DROP COLUMN "notes",
ADD COLUMN     "manual_code" VARCHAR(6);

-- CreateIndex
CREATE UNIQUE INDEX "visitor_passes_manual_code_key" ON "visitor_passes"("manual_code");
