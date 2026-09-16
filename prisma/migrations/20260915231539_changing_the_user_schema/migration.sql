-- AlterTable
ALTER TABLE "users" ADD COLUMN     "password_hash" VARCHAR(255),
ALTER COLUMN "ascribe_resident_id" DROP NOT NULL;
