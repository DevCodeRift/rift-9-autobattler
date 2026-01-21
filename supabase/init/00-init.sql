-- ============================================
-- SUPABASE BOOTSTRAP FOR SELF-HOSTING
-- ============================================

-- Create required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Create schemas
CREATE SCHEMA IF NOT EXISTS auth;
CREATE SCHEMA IF NOT EXISTS storage;
CREATE SCHEMA IF NOT EXISTS _realtime;

-- Create required roles (ignore errors if they exist)
DO $$
BEGIN
    CREATE ROLE anon NOLOGIN NOINHERIT;
EXCEPTION WHEN duplicate_object THEN
    NULL;
END $$;

DO $$
BEGIN
    CREATE ROLE authenticated NOLOGIN NOINHERIT;
EXCEPTION WHEN duplicate_object THEN
    NULL;
END $$;

DO $$
BEGIN
    CREATE ROLE service_role NOLOGIN NOINHERIT BYPASSRLS;
EXCEPTION WHEN duplicate_object THEN
    NULL;
END $$;

DO $$
BEGIN
    CREATE ROLE supabase_auth_admin NOLOGIN NOINHERIT;
EXCEPTION WHEN duplicate_object THEN
    NULL;
END $$;

DO $$
BEGIN
    CREATE ROLE supabase_storage_admin NOLOGIN NOINHERIT;
EXCEPTION WHEN duplicate_object THEN
    NULL;
END $$;

-- Grant schema permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON SCHEMA public TO anon, authenticated, service_role;
GRANT USAGE ON SCHEMA auth TO supabase_auth_admin;
GRANT ALL ON SCHEMA auth TO supabase_auth_admin;
GRANT USAGE ON SCHEMA storage TO supabase_storage_admin;
GRANT ALL ON SCHEMA storage TO supabase_storage_admin;

-- Default privileges for future tables
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON FUNCTIONS TO anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO anon, authenticated, service_role;

-- ============================================
-- AUTH SCHEMA (Minimal for GoTrue)
-- ============================================

-- Auth users table (managed by GoTrue)
CREATE TABLE IF NOT EXISTS auth.users (
    instance_id UUID,
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    aud VARCHAR(255),
    role VARCHAR(255),
    email VARCHAR(255) UNIQUE,
    encrypted_password VARCHAR(255),
    email_confirmed_at TIMESTAMPTZ,
    invited_at TIMESTAMPTZ,
    confirmation_token VARCHAR(255),
    confirmation_sent_at TIMESTAMPTZ,
    recovery_token VARCHAR(255),
    recovery_sent_at TIMESTAMPTZ,
    email_change_token_new VARCHAR(255),
    email_change VARCHAR(255),
    email_change_sent_at TIMESTAMPTZ,
    last_sign_in_at TIMESTAMPTZ,
    raw_app_meta_data JSONB,
    raw_user_meta_data JSONB,
    is_super_admin BOOLEAN,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    phone VARCHAR(15) UNIQUE DEFAULT NULL,
    phone_confirmed_at TIMESTAMPTZ,
    phone_change VARCHAR(15) DEFAULT '',
    phone_change_token VARCHAR(255) DEFAULT '',
    phone_change_sent_at TIMESTAMPTZ,
    email_change_token_current VARCHAR(255) DEFAULT '',
    email_change_confirm_status SMALLINT DEFAULT 0,
    banned_until TIMESTAMPTZ,
    reauthentication_token VARCHAR(255) DEFAULT '',
    reauthentication_sent_at TIMESTAMPTZ,
    is_sso_user BOOLEAN DEFAULT FALSE,
    deleted_at TIMESTAMPTZ
);

-- Grant table permissions to auth admin
GRANT ALL ON auth.users TO supabase_auth_admin;
GRANT SELECT ON auth.users TO anon, authenticated, service_role;

-- ============================================
-- AUTH FUNCTIONS
-- ============================================

-- Function to get current user ID from JWT
CREATE OR REPLACE FUNCTION auth.uid()
RETURNS UUID
LANGUAGE sql
STABLE
AS $$
    SELECT NULLIF(
        COALESCE(
            current_setting('request.jwt.claim.sub', true),
            (current_setting('request.jwt.claims', true)::json->>'sub')
        ),
        ''
    )::UUID;
$$;

-- Function to get current user role from JWT
CREATE OR REPLACE FUNCTION auth.role()
RETURNS TEXT
LANGUAGE sql
STABLE
AS $$
    SELECT NULLIF(
        COALESCE(
            current_setting('request.jwt.claim.role', true),
            (current_setting('request.jwt.claims', true)::json->>'role')
        ),
        ''
    )::TEXT;
$$;

-- Grant function permissions
GRANT EXECUTE ON FUNCTION auth.uid() TO anon, authenticated, service_role;
GRANT EXECUTE ON FUNCTION auth.role() TO anon, authenticated, service_role;

-- ============================================
-- REALTIME SETUP
-- ============================================

-- Create publication for realtime
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_publication WHERE pubname = 'supabase_realtime') THEN
        CREATE PUBLICATION supabase_realtime;
    END IF;
END $$;
