-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateEnum
CREATE TYPE "user_role" AS ENUM ('resident', 'guard', 'admin');

-- CreateEnum
CREATE TYPE "user_status" AS ENUM ('active', 'disabled');

-- CreateEnum
CREATE TYPE "visit_action" AS ENUM ('check_in', 'check_out');

-- CreateEnum
CREATE TYPE "visit_purpose" AS ENUM ('family', 'friend', 'delivery', 'maintenance', 'business', 'other');

-- CreateEnum
CREATE TYPE "visitor_pass_status" AS ENUM ('pending', 'checked_in', 'checked_out', 'expired', 'cancelled');

-- CreateTable
CREATE TABLE "apartments" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "unit_number" VARCHAR(20) NOT NULL,
    "block" VARCHAR(50),
    "floor" INTEGER,
    "resident_id" UUID,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "apartments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "full_name" VARCHAR(100) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "phone" VARCHAR(20),
    "password_hash" TEXT NOT NULL,
    "role" "user_role" NOT NULL,
    "status" "user_status" NOT NULL DEFAULT 'active',
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "visit_logs" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "visitor_pass_id" UUID NOT NULL,
    "guard_id" UUID NOT NULL,
    "action" "visit_action" NOT NULL,
    "timestamp" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "visit_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "visitor_passes" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "visitor_id" UUID NOT NULL,
    "resident_id" UUID NOT NULL,
    "apartment_id" UUID NOT NULL,
    "purpose" "visit_purpose" NOT NULL,
    "notes" TEXT,
    "num_of_guests" INTEGER NOT NULL DEFAULT 1,
    "expected_arrival_at" TIMESTAMPTZ(6) NOT NULL,
    "expires_at" TIMESTAMPTZ(6) NOT NULL,
    "qr_token" UUID NOT NULL DEFAULT gen_random_uuid(),
    "status" "visitor_pass_status" NOT NULL DEFAULT 'pending',
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "cancelled_at" TIMESTAMPTZ(6),

    CONSTRAINT "visitor_passes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "visitors" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "full_name" VARCHAR(100) NOT NULL,
    "phone" VARCHAR(20),
    "vehicle_reg" VARCHAR(20),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "visitors_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sessions" (
    "sid" VARCHAR NOT NULL,
    "sess" JSON NOT NULL,
    "expire" TIMESTAMP(6) NOT NULL,

    CONSTRAINT "session_pkey" PRIMARY KEY ("sid")
);

-- CreateIndex
CREATE UNIQUE INDEX "apartments_resident_id_key" ON "apartments"("resident_id");

-- CreateIndex
CREATE UNIQUE INDEX "unique_unit" ON "apartments"("unit_number", "block");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE INDEX "idx_users_email" ON "users"("email");

-- CreateIndex
CREATE INDEX "idx_logs_guard" ON "visit_logs"("guard_id");

-- CreateIndex
CREATE INDEX "idx_logs_pass" ON "visit_logs"("visitor_pass_id");

-- CreateIndex
CREATE UNIQUE INDEX "visitor_passes_qr_token_key" ON "visitor_passes"("qr_token");

-- CreateIndex
CREATE INDEX "idx_pass_arrival" ON "visitor_passes"("expected_arrival_at");

-- CreateIndex
CREATE INDEX "idx_pass_resident" ON "visitor_passes"("resident_id");

-- CreateIndex
CREATE INDEX "idx_pass_status" ON "visitor_passes"("status");

-- CreateIndex
CREATE INDEX "idx_pass_visitor" ON "visitor_passes"("visitor_id");

-- CreateIndex
CREATE INDEX "IDX_session_expire" ON "sessions"("expire");

-- AddForeignKey
ALTER TABLE "apartments" ADD CONSTRAINT "fk_apartment_resident" FOREIGN KEY ("resident_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "visit_logs" ADD CONSTRAINT "fk_log_guard" FOREIGN KEY ("guard_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "visit_logs" ADD CONSTRAINT "fk_log_pass" FOREIGN KEY ("visitor_pass_id") REFERENCES "visitor_passes"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "visitor_passes" ADD CONSTRAINT "fk_pass_apartment" FOREIGN KEY ("apartment_id") REFERENCES "apartments"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "visitor_passes" ADD CONSTRAINT "fk_pass_resident" FOREIGN KEY ("resident_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "visitor_passes" ADD CONSTRAINT "fk_pass_visitor" FOREIGN KEY ("visitor_id") REFERENCES "visitors"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

