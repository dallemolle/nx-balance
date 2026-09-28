-- Extensões
-- citext: texto case-insensitive (e-mail dos usuários, a partir do M1).
CREATE EXTENSION IF NOT EXISTS citext;

-- CreateTable
CREATE TABLE "system_settings" (
    "key" TEXT NOT NULL,
    "value" JSONB NOT NULL,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "system_settings_pkey" PRIMARY KEY ("key")
);
