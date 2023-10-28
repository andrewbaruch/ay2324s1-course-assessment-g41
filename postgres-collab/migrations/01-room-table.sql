CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- CreateTable
CREATE TABLE Room (
    id SERIAL PRIMARY KEY,
    user_id_1 TEXT NOT NULL,
    user_id_2 TEXT NOT NULL,
    name TEXT NOT NULL UNIQUE,
    is_open BOOLEAN NOT NULL DEFAULT false,
    attempt_id TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);
