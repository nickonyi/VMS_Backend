-- =====================================================
-- Visitor Management System Database Initialization
-- =====================================================

-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =====================================================
-- Drop Existing Objects
-- =====================================================

DROP TABLE IF EXISTS visit_logs CASCADE;
DROP TABLE IF EXISTS visitor_passes CASCADE;
DROP TABLE IF EXISTS visitors CASCADE;
DROP TABLE IF EXISTS apartments CASCADE;
DROP TABLE IF EXISTS users CASCADE;

DROP TYPE IF EXISTS visit_action CASCADE;
DROP TYPE IF EXISTS visitor_pass_status CASCADE;
DROP TYPE IF EXISTS user_status CASCADE;
DROP TYPE IF EXISTS user_role CASCADE;
DROP TYPE IF EXISTS visit_purpose CASCADE;


-- =====================================================
-- Enums
-- =====================================================

CREATE TYPE user_role AS ENUM (
    'resident',
    'guard',
    'admin'
);

CREATE TYPE user_status AS ENUM (
    'active',
    'disabled'
);

CREATE TYPE visitor_pass_status AS ENUM (
    'pending',
    'checked_in',
    'checked_out',
    'expired',
    'cancelled'
);

CREATE TYPE visit_action AS ENUM (
    'check_in',
    'check_out'
);

CREATE TYPE visit_purpose AS ENUM (
    'family',
    'friend',
    'delivery',
    'maintenance',
    'business',
    'other'
);


-- =====================================================
-- Users
-- =====================================================

CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    phone VARCHAR(20),

    password_hash TEXT NOT NULL,

    role user_role NOT NULL,
    status user_status NOT NULL DEFAULT 'active',

    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);


-- =====================================================
-- Apartments
-- =====================================================

CREATE TABLE apartments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    unit_number VARCHAR(20) NOT NULL,
    block VARCHAR(50),
    floor INTEGER,

    resident_id UUID UNIQUE,

    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_apartment_resident
        FOREIGN KEY (resident_id)
        REFERENCES users(id)
        ON DELETE SET NULL,

    CONSTRAINT unique_unit
        UNIQUE(unit_number, block)
);


-- =====================================================
-- Visitors
-- =====================================================

CREATE TABLE visitors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    full_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    vehicle_reg VARCHAR(20),

    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);


-- =====================================================
-- Visitor Passes
-- =====================================================

CREATE TABLE visitor_passes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    visitor_id UUID NOT NULL,
    resident_id UUID NOT NULL,
    apartment_id UUID NOT NULL,

    purpose visit_purpose NOT NULL,
    notes TEXT,

    num_of_guests INTEGER NOT NULL DEFAULT 1,

    expected_arrival_at TIMESTAMPTZ NOT NULL,
    expires_at TIMESTAMPTZ NOT NULL,

    qr_token UUID NOT NULL UNIQUE DEFAULT gen_random_uuid(),

    status visitor_pass_status NOT NULL DEFAULT 'pending',

    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    cancelled_at TIMESTAMPTZ,

    CONSTRAINT fk_pass_visitor
        FOREIGN KEY (visitor_id)
        REFERENCES visitors(id)
        ON DELETE RESTRICT,

    CONSTRAINT fk_pass_resident
        FOREIGN KEY (resident_id)
        REFERENCES users(id)
        ON DELETE RESTRICT,

    CONSTRAINT fk_pass_apartment
        FOREIGN KEY (apartment_id)
        REFERENCES apartments(id)
        ON DELETE RESTRICT,

    CONSTRAINT chk_guest_count
        CHECK (num_of_guests > 0),

    CONSTRAINT chk_expiry
        CHECK (expires_at > expected_arrival_at)
);


-- =====================================================
-- Visit Logs
-- =====================================================

CREATE TABLE visit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    visitor_pass_id UUID NOT NULL,
    guard_id UUID NOT NULL,

    action visit_action NOT NULL,

    timestamp TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_log_pass
        FOREIGN KEY (visitor_pass_id)
        REFERENCES visitor_passes(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_log_guard
        FOREIGN KEY (guard_id)
        REFERENCES users(id)
        ON DELETE RESTRICT
);


-- =====================================================
-- Indexes
-- =====================================================

CREATE INDEX idx_users_email
    ON users(email);

CREATE INDEX idx_pass_resident
    ON visitor_passes(resident_id);

CREATE INDEX idx_pass_visitor
    ON visitor_passes(visitor_id);

CREATE INDEX idx_pass_status
    ON visitor_passes(status);

CREATE INDEX idx_pass_arrival
    ON visitor_passes(expected_arrival_at);

CREATE INDEX idx_logs_pass
    ON visit_logs(visitor_pass_id);

CREATE INDEX idx_logs_guard
    ON visit_logs(guard_id);


-- =====================================================
-- Database Created Successfully
-- =====================================================