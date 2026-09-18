-- DropForeignKey
ALTER TABLE "apartments" DROP CONSTRAINT "apartments_property_id_fkey";

-- AlterTable
ALTER TABLE "apartments" ALTER COLUMN "property_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "apartments" ADD CONSTRAINT "apartments_property_id_fkey" FOREIGN KEY ("property_id") REFERENCES "properties"("id") ON DELETE SET NULL ON UPDATE NO ACTION;
